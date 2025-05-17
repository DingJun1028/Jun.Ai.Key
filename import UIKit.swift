import UIKit

class MyViewController: UIViewController {

    lazy var signInButton: UIButton = {
        let button = UIButton(type: .system)
        button.setTitle("Sign In to Google Drive", for: .normal)
        button.addTarget(self, action: #selector(didTapSignIn), for: .touchUpInside)
        button.translatesAutoresizingMaskIntoConstraints = false
        return button
    }()

    lazy var listFilesButton: UIButton = {
        let button = UIButton(type: .system)
        button.setTitle("List Drive Files", for: .normal)
        button.addTarget(self, action: #selector(didTapListFiles), for: .touchUpInside)
        button.translatesAutoresizingMaskIntoConstraints = false
        button.isEnabled = false // Initially disabled
        return button
    }()

    lazy var signOutButton: UIButton = {
        let button = UIButton(type: .system)
        button.setTitle("Sign Out", for: .normal)
        button.addTarget(self, action: #selector(didTapSignOut), for: .touchUpInside)
        button.translatesAutoresizingMaskIntoConstraints = false
        button.isEnabled = false // Initially disabled
        return button
    }()

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .white
        setupUI()
        updateButtonStates()
    }

    private func setupUI() {
        view.addSubview(signInButton)
        view.addSubview(listFilesButton)
        view.addSubview(signOutButton)

        NSLayoutConstraint.activate([
            signInButton.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            signInButton.centerYAnchor.constraint(equalTo: view.centerYAnchor, constant: -50),

            listFilesButton.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            listFilesButton.topAnchor.constraint(equalTo: signInButton.bottomAnchor, constant: 20),

            signOutButton.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            signOutButton.topAnchor.constraint(equalTo: listFilesButton.bottomAnchor, constant: 20)
        ])
    }

    private func updateButtonStates() {
        let isSignedIn = DriveManager.shared.isSignedIn
        signInButton.isEnabled = !isSignedIn
        listFilesButton.isEnabled = isSignedIn
        signOutButton.isEnabled = isSignedIn
    }

    @objc private func didTapSignIn() {
        DriveManager.shared.signIn(presentingViewController: self) { [weak self] error in
            guard let self = self else { return }
            if let error = error {
                print("Sign-in failed: \(error.localizedDescription)")
                // Show alert to user
            } else {
                print("Sign-in successful!")
            }
            self.updateButtonStates()
        }
    }

    @objc private func didTapListFiles() {
        DriveManager.shared.listFiles { result in
            switch result {
            case .success(let files):
                print("Found \(files.count) files:")
                files.forEach { print("- \($0.name ?? "Untitled") (ID: \($0.identifier ?? "N/A"))") }
                // Update UI with files
            case .failure(let error):
                print("Failed to list files: \(error.localizedDescription)")
                // Show alert to user
            }
        }
    }

    @objc private func didTapSignOut() {
        DriveManager.shared.signOut()
        updateButtonStates()
        print("Signed out.")
    }
}