import Foundation
import GoogleSignIn
import GoogleAPIClientForREST_Drive // Ensure this import is correct for your setup

/// Custom error types for DriveManager operations.
enum DriveManagerError: Error {
    case notSignedIn
    case apiError(Error)
    case userDataUnavailable
    case generalError(String)

    var localizedDescription: String {
        switch self {
        case .notSignedIn:
            return "User is not signed in or Drive service is not authorized."
        case .apiError(let underlyingError):
            return "Google Drive API error: \(underlyingError.localizedDescription)"
        case .userDataUnavailable:
            return "User data not available after sign-in."
        case .generalError(let message):
            return message
        }
    }
}

/// Manages interactions with the Google Drive API.
class DriveManager {
    /// Shared singleton instance of DriveManager.
    static let shared = DriveManager()

    private let driveService = GTLRDriveService()

    /// Private initializer to enforce singleton pattern.
    private init() {}

    /// Checks if the user is currently signed in and the Drive service is authorized.
    var isSignedIn: Bool {
        return GIDSignIn.sharedInstance.currentUser != nil && driveService.authorizer != nil
    }

    /// Initiates the Google Sign-In process and requests Drive API scopes.
    /// - Parameters:
    ///   - presentingViewController: The view controller from which to present the sign-in flow.
    ///   - completion: A closure called upon completion, with an optional error.
    func signIn(presentingViewController: UIViewController, completion: @escaping (Error?) -> Void) {
        // Define the scopes your app needs. Adjust these based on your app's requirements.
        // kGTLRAuthScopeDriveFile: Per-file access to files created or opened by the app. (Recommended for most apps)
        // kGTLRAuthScopeDriveReadonly: Read-only access to all files.
        // kGTLRAuthScopeDrive: Full, permissive scope to access all of a user's files. Use with caution.
        let driveScopes = [
            kGTLRAuthScopeDriveFile,
            kGTLRAuthScopeDriveReadonly
            // Add other scopes like kGTLRAuthScopeDriveMetadataReadonly if needed
        ]

        GIDSignIn.sharedInstance.signIn(withPresenting: presentingViewController, hint: nil, additionalScopes: driveScopes) { signInResult, error in
            if let error = error {
                print("DriveManager: Google Sign-In error: \(error.localizedDescription)")
                completion(error)
                return
            }

            guard let user = signInResult?.user else {
                print("DriveManager: Google Sign-In error: User data not available.")
                completion(DriveManagerError.userDataUnavailable)
                return
            }

            print("DriveManager: Successfully signed in as \(user.profile?.name ?? "Unknown User")")
            // Set the authorizer for the Drive service. This allows the service to make authenticated API calls.
            self.driveService.authorizer = user.fetcherAuthorizer
            completion(nil)
        }
    }

    /// Signs out the current user from Google Sign-In and clears the Drive service authorizer.
    func signOut() {
        GIDSignIn.sharedInstance.signOut()
        driveService.authorizer = nil // Clear the authorizer
        print("DriveManager: User signed out.")
    }

    /// Lists files and folders from the user's Google Drive.
    /// - Parameters:
    ///   - q: An optional query string to filter files (e.g., "mimeType='application/vnd.google-apps.folder'").
    ///        Refer to Google Drive API documentation for query syntax.
    ///   - completion: A closure called with the result (an array of `GTLRDrive_File` objects or an error).
    func listFiles(query q: String? = nil, completion: @escaping (Result<[GTLRDrive_File], DriveManagerError>) -> Void) {
        guard isSignedIn else {
            completion(.failure(.notSignedIn))
            return
        }

        let query = GTLRDriveQuery_FilesList.query()
        query.pageSize = 100 // You can adjust the page size.
        // Specify the fields you want to retrieve for each file.
        // "id, name, mimeType" are common. Add more as needed (e.g., "createdTime, modifiedTime, size, webViewLink, parents").
        query.fields = "nextPageToken, files(id, name, mimeType, parents)" // Customize fields as needed

        if let filterQuery = q, !filterQuery.isEmpty {
            query.q = filterQuery
        }

        driveService.executeQuery(query) { (ticket, result, error) in
            if let error = error {
                print("DriveManager: Error listing files: \(error.localizedDescription)")
                completion(.failure(.apiError(error)))
                return
            }

            if let files = (result as? GTLRDrive_FileList)?.files {
                completion(.success(files))
            } else {
                // This case might occur if the result is not in the expected format or if no files are found
                // and the API returns a valid but empty FileList.
                print("DriveManager: No files found or unexpected result structure.")
                completion(.success([]))
            }
        }
    }

    // You can add more methods here for other Drive operations like:
    // - func uploadFile(...)
    // - func downloadFile(...)
    // - func createFolder(...)
    // - func deleteFile(...)
}