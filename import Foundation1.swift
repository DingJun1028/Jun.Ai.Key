import Foundation
import GoogleSignIn
import GoogleAPIClientForREST_Drive // Make sure to import the Drive module

enum DriveManagerError: Error {
    case notSignedIn
    case apiError(Error)
    case userDataUnavailable
    case fileNotFound
    case dataConversionError
    case generalError(String)

    var localizedDescription: String {
        switch self {
        case .notSignedIn:
            return "User is not signed in or Drive service is not authorized."
        case .apiError(let underlyingError):
            return "Google Drive API error: \(underlyingError.localizedDescription)"
        case .userDataUnavailable:
            return "User data not available after sign-in."
        case .fileNotFound:
            return "The requested file was not found."
        case .dataConversionError:
            return "Could not convert data for upload/download."
        case .generalError(let message):
            return message
        }
    }
}

class DriveManager {
    static let shared = DriveManager()
    private let driveService = GTLRDriveService()

    private init() {}

    var isSignedIn: Bool {
        return GIDSignIn.sharedInstance.currentUser != nil && driveService.authorizer != nil
    }

    /// Initiates the Google Sign-In process.
    /// - Parameters:
    ///   - presentingViewController: The view controller to present the sign-in flow from.
    ///   - completion: A closure called upon completion, with an optional error.
    func signIn(presentingViewController: UIViewController, completion: @escaping (Error?) -> Void) {
        // Define the scopes your app needs.
        // kGTLRAuthScopeDriveFile: Per-file access to files created or opened by the app. (Recommended for most apps)
        // kGTLRAuthScopeDriveReadonly: Read-only access to all files.
        // kGTLRAuthScopeDrive: Full, permissive scope to access all of a user's files. Use with caution.
        let driveScopes = [
            kGTLRAuthScopeDriveFile,
            kGTLRAuthScopeDriveReadonly // Example: add more scopes if needed, like kGTLRAuthScopeDriveMetadataReadonly
        ]

        GIDSignIn.sharedInstance.signIn(withPresenting: presentingViewController, hint: nil, additionalScopes: driveScopes) { signInResult, error in
            if let error = error {
                print("Google Sign-In error: \(error.localizedDescription)")
                completion(error)
                return
            }

            guard let user = signInResult?.user else {
                print("Google Sign-In error: User data not available.")
                completion(DriveManagerError.userDataUnavailable)
                return
            }

            print("Successfully signed in as \(user.profile?.name ?? "Unknown User")")
            self.driveService.authorizer = user.fetcherAuthorizer
            completion(nil)
        }
    }

    /// Signs out the current user.
    func signOut() {
        GIDSignIn.sharedInstance.signOut()
        driveService.authorizer = nil
        print("User signed out.")
    }

    /// Lists files and folders from Google Drive.
    /// - Parameters:
    ///   - query: An optional query string to filter files (e.g., "mimeType='application/vnd.google-apps.folder'").
    ///   - completion: A closure called with the result (list of files or an error).
    func listFiles(query q: String? = nil, completion: @escaping (Result<[GTLRDrive_File], DriveManagerError>) -> Void) {
        guard isSignedIn else {
            completion(.failure(.notSignedIn))
            return
        }

        let query = GTLRDriveQuery_FilesList.query()
        query.pageSize = 100 // Adjust as needed
        query.fields = "nextPageToken, files(id, name, mimeType, createdTime, modifiedTime, size, webViewLink, parents)"
        if let q = q {
            query.q = q
        }

        driveService.executeQuery(query) { (ticket, result, error) in
            if let error = error {
                completion(.failure(.apiError(error)))
                return
            }

            if let files = (result as? GTLRDrive_FileList)?.files {
                completion(.success(files))
            } else {
                completion(.success([])) // No files found or unexpected result structure
            }
        }
    }

    /// Uploads a file to Google Drive.
    /// - Parameters:
    ///   - data: The file data to upload.
    ///   - fileName: The name for the file on Google Drive.
    ///   - mimeType: The MIME type of the file (e.g., "text/plain", "image/jpeg").
    ///   - parentFolderID: Optional ID of the parent folder to upload into. If nil, uploads to root.
    ///   - completion: A closure called with the result (the uploaded file metadata or an error).
    func uploadFile(data: Data, fileName: String, mimeType: String, parentFolderID: String? = nil, completion: @escaping (Result<GTLRDrive_File, DriveManagerError>) -> Void) {
        guard isSignedIn else {
            completion(.failure(.notSignedIn))
            return
        }

        let fileMetadata = GTLRDrive_File()
        fileMetadata.name = fileName
        if let parentFolderID = parentFolderID {
            fileMetadata.parents = [parentFolderID]
        }

        let uploadParameters = GTLRUploadParameters(data: data, mimeType: mimeType)
        uploadParameters.shouldUploadWithSingleRequest = true // For smaller files

        let query = GTLRDriveQuery_FilesCreate.query(withObject: fileMetadata, uploadParameters: uploadParameters)
        query.fields = "id, name, mimeType, webViewLink"

        driveService.executeQuery(query) { (ticket, file, error) in
            if let error = error {
                completion(.failure(.apiError(error)))
                return
            }
            if let file = file as? GTLRDrive_File {
                completion(.success(file))
            } else {
                completion(.failure(.generalError("Uploaded file metadata not received.")))
            }
        }
    }

    /// Downloads a file from Google Drive.
    /// - Parameters:
    ///   - fileId: The ID of the file to download.
    ///   - completion: A closure called with the result (file data or an error).
    func downloadFile(fileId: String, completion: @escaping (Result<Data, DriveManagerError>) -> Void) {
        guard isSignedIn else {
            completion(.failure(.notSignedIn))
            return
        }

        let query = GTLRDriveQuery_FilesGet.queryForMedia(withFileId: fileId)
        driveService.executeQuery(query) { (ticket, file, error) in
            if let error = error {
                completion(.failure(.apiError(error)))
                return
            }

            if let data = (file as? GTLRDataObject)?.data {
                completion(.success(data))
            } else {
                completion(.failure(.dataConversionError))
            }
        }
    }

    // You can add more methods like createFolder, deleteFile, updateFile, etc.
    // Example:
    // func createFolder(name: String, parentFolderID: String? = nil, completion: @escaping (Result<GTLRDrive_File, DriveManagerError>) -> Void) { ... }
}