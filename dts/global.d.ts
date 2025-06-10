import { Color, ColorScheme } from "scripting"

declare global {

  /**
   * The console object provides access to the debugging console pop-up view.
   */
  const console: {
    /**
     * Outputs a message to the console pop-up view.
     */
    log(...args: any[]): void
    /**
     * Outputs a message to the console pop-up view at the "error" log level.
     */
    error(...args: any[]): void
    /**
     * Clears the console if possible.
     */
    clear(): void
    /**
     * Present a console pop-up view.
     * This method allows you to view the printed console messages. When your script does not have any UI to display, but you want to view the script running log, please call this method. Promise will resolve after the pop-up view is dismissed.
     */
    present(): Promive<void>
  }

  /**
   * Start a timer, the callback function will be executed after the specified time interval. Returns a number timer id.
   */
  const setTimeout: (callback: () => void, timeout?: number) => number
  /**
   * Stop a timer by a given timer id.
   */
  const clearTimeout: (timerId: number) => void

  /**
   * Provides the information abouts the device, also some methods to use the capabilities of the device.
   *
   */
  declare module Device {
    /**
     * Model of the device, e.g. "iPhone".
     */
    readonly const model: string
    /**
     * The current version of the operating system.
     */
    readonly const systemVersion: string
    /**
     * The name of the operating system running on the device.
     */
    readonly const systemName: string
    readonly const isiPad: boolean
    readonly const isiPhone: boolean
    readonly const screen: {
      width: number
      height: number
      scale: number
    }
    readonly const batteryState: "full" | "charging" | "unplugged" | "unknown"
    readonly const batteryLevel: number
    readonly const isLandscape: boolean
    readonly const isPortrait: boolean
    readonly const isFlat: boolean
    readonly const colorScheme: ColorScheme
    /**
     * A boolean value that indicates whether the process is an iPhone or iPad app running on a Mac.
     */
    readonly const isiOSAppOnMac: boolean
    /**
     * The current locale used by the system, such as `"en_US"`.
     */
    readonly const systemLocale: string
    /**
     * User preferred locales, such as `["en-US", "zh-Hans-CN"]`.
     */
    readonly const systemLocales: string[]
    /**
     * The current locale language tag, such as `"en-US"`
     */
    readonly const systemLanguageTag: string
    /**
     * The current locale language code, such as `"en"`
     */
    readonly const systemLanguageCode: string
    /**
     * The current locale country code, such as `"US"`
     */
    readonly const systemCountryCode: string | undefined
    /**
     * The current locale script code, such as `"Hans"` of `"zh_CN_Hans"`
     */
    readonly const systemScriptCode: string | undefined

    /**
     * Retrieve the current wakelock status.
     */
    readonly const isWakeLockEnabled: Promise<boolean>

    /**
     * Enable or disable the wakelock. This method is only available in Scripting app.
     * @param enabled Whether to enable or disable the wake lock.
     */
    function setWakeLockEnabled(enabled: boolean): void
  }

  /**
   * A byte buffer in memory.
   */
  declare class Data {
    getBytes(): Uint8Array | null
    toArrayBuffer(): ArrayBuffer
    toBase64String(): string
    toRawString(encoding?: string): string | null

    static fromString(string: string, encoding?: string): Data | null
    static fromFile(filePath: string): Data | null
    static fromArrayBuffer(arrayBuffer: ArrayBuffer): Data | null
    static fromBase64String(base64Encoded: string): Data | null
    static fromJPEG(image: UIImage, compressionQuality?: number): Data | null
    static fromPNG(image: UIImage): Data | null
    static combine(dataList: Data[]): Data
  }

  /**
   * A module for encrypting data using various algorithms.
   */
  declare module Crypto {
    /**
     * Encrypts the given data using the sha256 algorithm and returns the hash as a hexadecimal string.
     * @param data The data to be hashed.
     */
    function sha256(data: Data): string
    /**
     * Encrypts the given data using the sha384 algorithm and returns the hash as a hexadecimal string.
     * @param data The data to be hashed.
     */
    function sha384(data: Data): string
    /**
     * Encrypts the given data using the sha512 algorithm and returns the hash as a hexadecimal string.
     * @param data The data to be hashed.
     */
    function sha512(data: Data): string
  }

  /**
   * A module for generating UUID string.
   */
  declare module UUID {
    /**
     * Generate a UUID string.
     */
    function string(): string
  }

  /**
   * A module for hashing messages with MD5
   */
  declare module MD5 {
    /**
     * Create a MD5 hash with hex encoding.
     */
    function hex(str: string): string
    /**
     * Create a MD5 hash with base64 encoding.
     */
    function base64(str: string): string
  }

  /**
   * UIImage instance for displaying or saving an Image.
   */
  declare class UIImage {
    readonly width: number
    readonly height: number

    static fromData(data: Data): UIImage | null
    static fromFile(filePath: string): UIImage | null
  }

  /**
   * Read and set the clipboard
   *
   * If you want to quickly paste text from other apps, you can go to
   * **Settings > Scripting > Paste from Other Apps > Allow**
   */
  declare module Clipboard {
    /**
     * Copy text to clipboard.
     * @param text Text content
     */
    function copyText(text: string): Promise<void>
    /**
     * Get text form clipboard.
     * @returns Text content string or null
     */
    function getText(): Promise<string | null>
  }

  /**
   * Present a website either in-app or leaving the app and opening the system default browser.
   */
  declare module Safari {
    /**
     * Open a website in the system default browser.
     * @param url URL of website to present.
     */
    function openURL(url: string): Promise<boolean>
    /**
     * Present a website in-app using Safari browser.
     * @param url URL of website to present.
     * @param fullscreen Whether to present the website in fullscreen. Defaults to true.
     */
    function present(url: string, fullscreen?: boolean): Promise<void>
  }

  type LocalAuthBiometryType = "faceID" | 'touchID' | 'opticID' | 'none' | 'unknown'

  /**
   * This interface provides authentication with biometrics such as fingerprint or facial recognition.
   */
  declare module LocalAuth {
    /**
     * Check whether authentication can proceed for any policies.
     */
    const isAvailable: boolean
    /**
     * Check whether authentication can proceed for any biometry policies.
     */
    const isBiometricsAvailable: boolean
    /**
     * The type of biometric authentication supported by the device.
     */
    const biometryType: LocalAuthBiometryType
    /**
     * Authenticates the user with biometrics available on the device.
     * Returns true if the user successfully authenticated, false otherwise.
     *
     * @param reason The message to show to user while prompting them for authentication. This is typically along the lines of: `'Authenticate to access MyScript.'`. This must not be empty.
     * @param useBiometrics If specify true, will authenticate a user with biometry, otherwise authenticate a user in iOS with either biometrics or a passcode, in watchOS with a passcode, or in macOS with Touch ID, Apple Watch, or the user’s password. Defaults to true.
     */
    function authenticate(reason: string, useBiometrics?: boolean): Promise<boolean>
  }

  /**
   * Create previews of texts, images or files to use inside your script.
   */
  declare module QuickLook {
    /**
     * Displays a preview of a text string. `fullscreen` defaults to false. The promise will be resolved after the preview is dismissed.
     */
    function previewText(text: string, fullscreen?: boolean): Promise<void>
    /**
     * Displays a preview of an image. `fullscreen` defaults to false. The promise will be resolved after the preview is dismissed.
     */
    function previewImage(image: UIImage, fullscreen?: boolean): Promise<void>
    /**
     * Displays a preview of one or more files located at the given file URL strings. `fullscreen` defaults to false. The promise will be resolved after the preview is dismissed.
     */
    function previewURLs(urls: string[], fullscreen?: boolean): Promise<void>
  }

  /**
   * This interface provides some shortcut methods for displaying dialog boxes.
   */
  declare module Dialog {
    /**
     * Display an Alert UI.
     */
    function alert(options: {
      /** The message of the alert. */
      message: string
      /** The title of the alert. */
      title?: string
      /** Set the button label you want. */
      buttonLabel?: string
    }): Promise<void>
    /**
     * Display an Confirm modal, return a promise that will resolve a boolean value that indicate whether the user confirm or not.
     */
    function confirm(options: {
      /**
       * The message of the confirm.
       */
      message: string
      /**
       * The title of the confirm.
       */
      title?: string
      /**
       * The label of the cancel button.
       */
      cancelLabel?: string
      /**
       * The label of the confirm button.
       */
      confirmLabel?: string
    }): Promise<boolean>
    /**
     * Display a Prompt UI. Returns string result or null.
     */
    function prompt(options: {
      /** You need to provide a title to describe the purpose */
      title: string
      /** A supporting information */
      message?: string
      /** The default value for the `TextField` */
      defaultValue?: string
      /** Whether to use obscure text */
      obscureText?: boolean
      /** Whether the value of the `TextField` is selected */
      selectAll?: boolean
      /** The placeholder text for the `TextField` */
      placeholder?: string
      /** The cancel button label */
      cancelLabel?: string
      /** The confirm button label */
      confirmLabel?: string
      /** You can specify the type of keyboard to invoke */
      keyboardType?: KeyboardType
    }): Promise<string | null>
    /**
     * Display an action sheet with multiple content options. When the user clicks an item, the index of the item will be returned. If the user clicks Cancel, null will be returned.
     * @param options
     * @param options.title You can set a top title.
     * @param options.message You can set a tip message.
     * @param options.cancelButton You can control whether to show the cancel button, defaults to `true`.
     * @param options.actions The actions of the UI.
     * @returns When the user clicks an item, the index of the item will be returned. If the user clicks Cancel, null will be returned.
     *
     * @example
     * ```ts
     * const index = await Dialog.actionSheet({
     *   title: 'Do you want to delete this image?',
     *   actions: [{
     *     label: 'Delete',
     *     destructive: true,
     *   }]
     * })
     *
     * if (index == null) {
     *   // User canceled.
     * } else if (index === 0) {
     *   // User tap the `delete` action.
     * }
     * ```
     */
    function actionSheet(options: {
      title: string
      message?: string
      cancelButton?: boolean
      actions: {
        /**
         * The label of the sheet action.
         */
        label: string
        /**
         * Set whether it is a destructive action, which will be visually different from a normal action.
         */
        destructive?: boolean
      }[]
    }): Promise<number | null>
  }

  /**
   * The interface to store data in Keychain.
   */
  declare module Keychain {
    /**
     * Encrypts and saves the `key` with the given `value`.
     *
     * If the key was already in the storage, its associated value is changed.
     */
    function set(key: string, value: string, options?: KeychainOptions): void
    /**
     * Decrypts and returns the value for the given `key` or `null` if `key` is not in the storage.
     */
    function get(key: string, options?: KeychainOptions): string | null
    /**
     * Deletes associated value for the given `key`.
     *
     * If the given `key` does not exist, nothing will happen.
     */
    function remove(key: string, options?: KeychainOptions): void
    /**
     * Returns true if the storage contains the given `key`.
     */
    function contains(key: string, options?: KeychainOptions): boolean
  }

  type KeychainOptions = {
    /**
     * A key with a value that indicates when the keychain item is accessible.
     */
    accessibility?: KeychainAccessibility
    /**
     * A key with a boolean value that indicates whether the item synchronizes through iCloud.
     */
    synchronizable?: boolean
  }
  /**
  *  - `passcode`: The data in the keychain can only be accessed when the device is unlocked. Only available if a passcode is set on the device. Items with this attribute do not migrate to a new device.
  *  - `unlocked`: The data in the keychain item can be accessed only while the device is unlocked by the user.
  *  - `unlocked_this_device`: The data in the keychain item can be accessed only while the device is unlocked by the user. Items with this attribute do not migrate to a new device.
  *  - `first_unlock`: The data in the keychain item cannot be accessed after a restart until the device has been unlocked once by the user.
  *  - `first_unlock_this_device`: The data in the keychain item cannot be accessed after a restart until the device has been unlocked once by the user. Items with this attribute do not migrate to a new device.
  */
  type KeychainAccessibility = 'passcode' | 'unlocked' | 'unlocked_this_device' | 'first_unlock' | 'first_unlock_this_device'

  /**
   * Haptic feedback provides a tactile response, such as a tap, that draws attention and reinforces both actions and events.
   */
  declare class HapticFeedback {
    /**
     * Invoke a brief vibration.
     */
    static vibrate(): void
    /**
     * A collision between small, light user interface elements.
     */
    static lightImpact(): void
    /**
     * A collision between moderately sized user interface elements.
     */
    static mediumImpact(): void
    /**
     * A collision between large, heavy user interface elements.
     */
    static heavyImpact(): void
    /**
     * A collision between user interface elements that are soft, exhibiting a large amount of compression or elasticity.
     */
    static softImpact(): void
    /**
     * A collision between user interface elements that are rigid, exhibiting a small amount of compression or elasticity.
     */
    static rigidImpact(): void
    /**
     * Triggers selection feedback. This method tells the generator that the user has changed a selection. In response, the generator may play the appropriate haptics. Don’t use this feedback when the user makes or confirms a selection; use it only when the selection changes.
     */
    static selection(): void
    /**
     * A notification feedback type that indicates a task has completed successfully.
     */
    static notificationSuccess(): void
    /**
     * A notification feedback type that indicates a task has failed.
     */
    static notificationError(): void
    /**
     * A notification feedback type that indicates a task has produced a warning.
     */
    static notificationWarning(): void
  }

  /**
   * The accuracy of a geographical coordinate.
   */
  type LocationAccuracy = "best" | "tenMeters" | "hundredMeters" | "kilometer" | "threeKilometers"
  type LocationInfo = {
    /**
     * The latitude in degrees.
     */
    latitude: number
    /**
     * The longitude in degrees.
     */
    longitude: number
  }
  /**
   * A user-friendly description of a geographic coordinate, often containing the name of the place, its address, and other relevant information.
   */
  type LocationPlacemark = {
    location?: LocationInfo
    region?: string
    timeZone?: string
    name?: string
    /**
     * The street address associated with the placemark.
     */
    thoroughfare?: string
    /**
     * Additional street-level information for the placemark.
     */
    subThoroughfare?: string
    /**
     * The city associated with the placemark.
     */
    locality?: string
    /**
     * Additional city-level information for the placemark.
     */
    subLocality?: string
    /**
     * The state or province associated with the placemark.
     */
    administrativeArea?: string
    /**
     * Additional administrative area information for the placemark.
     */
    subAdministrativeArea?: string
    /**
     * The postal code associated with the placemark.
     */
    postalCode?: string
    /**
     * The abbreviated country or region name.
     */
    isoCountryCode?: string
    /**
     * The name of the country or region associated with the placemark.
     */
    country?: string
    /**
     * The name of the inland water body associated with the placemark.
     */
    inlandWater?: string
    /**
     * The name of the ocean associated with the placemark.
     */
    ocean?: string
    /**
     * The relevant areas of interest associated with the placemark.
     */
    areasOfInterest?: string[]
  }

  /**
   * Getting the current location of your device.
   */
  declare class Location {

    /**
     * A Boolean value that indicates whether a widget is eligible to receive location updates.
     */
    static get isAuthorizedForWidgetUpdates(): Promise<boolean>

    /**
     * Set the accuracy of the location data that your app wants to receive.
     */
    static setAccuracy(accuracy: LocationAccuracy): Promise<void>
    /**
     * Requests the one-time delivery of the user’s current location.
     */
    static requestCurrent(): Promise<LocationInfo | null>
    /**
     * Pick a location from the iOS built-in map.
     */
    static pickFromMap(): Promise<LocationInfo | null>
    /**
     * Submits a reverse-geocoding request for the specified location and locale.
     */
    static reverseGeocode(options: {
      /**
       * The latitude in degrees.
       */
      latitude: number
      /**
       * The longitude in degrees.
       */
      longitude: number
      /**
       * The locale to use when returning the address information. You might specify a value for this parameter when you want the address returned in a locale that differs from the user’s current language settings. Specify null to use the user’s default locale information.
       */
      locale?: string
    }): Promise<LocationPlacemark[] | null>
  }

  type Encoding = 'utf-8' | 'ascii' | 'latin1'

  /**
   * The result of calling the POSIX `stat()` function on a file system object.
   */
  type FileStat = {
    creationDate: number
    /**
     * The time of the last change to the data of the file system object.
     */
    modificationDate: number
    /**
     * The type of the underlying file system object.
     *  - `"file"`
     *  - `"directory"`
     *  - `"link"`
     *  - `"unixDomainSock"`
     *  - `"pipe"`
     *  - `"notFound"`,
     */
    type: string
    size: number
  }
  /**
   * A convenient interface to the contents of the file system, and the primary means of interacting with it.
   */
  declare class FileManager {
    /**
     * Directory where scripts are stored.
     */
    static get scriptsDirectory(): string
    /**
     * Wether the iCloud is enabled.
     * If you are not logged into iCloud, or have not authorized the Scripting app to use iCloud features,
     * this method will return false.
     */
    static get isiCloudEnabled(): boolean
    /**
     * Returns the path to iCloud's `Documents` directory, if iCloud is disabled,
     * this method would throw an error, you should use `isiCloudEnabled` to check it.
     */
    static get iCloudDocumentsDirectory(): string
    /**
     * Returns a boolean value indicating whether the file is targeted for storage in iCloud.
     * @param filePath The path of the file
     */
    static isFileStoredIniCloud(filePath: string): boolean
    /**
     * Returns a boolean value indicating whether the file is downloaded from iCloud.
     * @param filePath  The path of the file
     */
    static isiCloudFileDownloaded(filePath: string): boolean
    /**
     * Download a iCloud file.
     * @param filePath The path of the file
     * @returns Returns a boolean value indicating whether the file was downloaded successful.
     */
    static downloadFileFromiCloud(filePath: string): Promise<boolean>
    /**
     * Returns the path to shared `App Group Documents` directory.
     * Files stored in this directory will not appear in the Files app,
     * but the script running in Widget can access these files.
     */
    static get appGroupDocumentsDirectory(): string
    /**
     * Returns the path to `Documents` directory, documents stored in ths directory can be
     * accessed using Files app, the script running in Widget cannot access these files.
     */
    static get documentsDirectory(): string
    /**
     * Returns the path to the temporary directory.
     */
    static get temporaryDirectory(): string
    /**
     * Returns the mime type of the file.
     * @param path The path of the file
     */
    static mimeType(path: string): string
    /**
     * Returns destination of a symbolic link.
     * @param path The path of the symbolic link
     */
    static destinationOfSymbolicLink(path: string): string
    /**
     * Generates a shareable URL for an iCloud file, allowing users to download the file. You need to use `try-catch` to handle the situation where this method call fails.
     * @param path The file path of the item in the cloud that you want to share. The path must be prefixed with the base path `FileManager.iCloudDocumentsDirectory` that corresponds to the item’s location. The file must be a flat file, not a bundle. The file at the specified path must already be uploaded to iCloud when you call this method.
     * @param expiration The expiration timestamp, you may ignore this parameter if you are not interested in the expiration date.
     */
    static getShareUrlOfiCloudFile(path: string, expiration?: number): string
    /**
     * Creates a directory at the specified path string.
     * @param path The path of the directory.
     * @param recursive If `true`, this method creates any nonexistent parent directories as part of creating the directory in path. If `false`, this method fails if any of the intermediate parent directories does not exist.
     */
    static createDirectory(path: string, recursive?: boolean): Promise<void>
    static createDirectorySync(path: string, recursive?: boolean): void
    /**
     * Creates a symbolic link at the specified path that points to an item at the given path.
     * @param path The file path at which to create the new symbolic link. The last path component of the path issued as the name of the link.
     * @param target The file path that contains the item to be pointed to by the link. In other words, this is the destination of the link.
     */
    static createLink(path: string, target: string): Promise<void>
    static createLinkSync(path: string, target: string): void
    /**
     * Copies the item at the specified path to a new location synchronously.
     * @param path The path to the file or directory you want to move.
     * @param newPath The path at which to place the copy of `path`. This path must include the name of the file or directory in its new location.
     */
    static copyFile(path: string, newPath: string): Promise<void>
    static copyFileSync(path: string, newPath: string): void
    /**
     * Performs a shallow search of the specified directory and returns the paths of any contained items.
     * Optionally recurses into sub-directories.
     * @param path The path to the directory whose contents you want to enumerate.
     * @param recursive Whether recurses into sub-directories.
     * @returns The result is a list of string for the directories, files, and links.
     */
    static readDirectory(path: string, recursive?: boolean): Promise<string[]>
    static readDirectorySync(path: string, recursive?: boolean): string[]
    /**
     * Returns a boolean value that indicates whether a file or directory exists at a specified path.
     * @param path The path of the file or directory
     */
    static exists(path: string): Promise<boolean>
    static existsSync(path: string): boolean
    /**
     * Get path to a bookmarked file or folder.
     * @param name Name of a bookmark.
     */
    static bookmarkExists(name: string): boolean
    /**
     * Get all file bookmarks. File bookmarks are used to bookmark a file or a folder and read or write to it late in your script.
     * They can be created from File Bookmarks tool, they also were automatic created by Intent for Shortcuts app or Share Sheet.
     */
    static getAllFileBookmarks(): Array<{
      /**
       * Name of the bookmark.
       */
      name: string
      /**
       * The path of the bookmarked file or folder.
       */
      path: string
    }>
    /**
     * Try to get the path of a bookmarked file or folder by a given name, if the bookmark of the name is not exists, returns `null`.
     * @param name Name of a bookmark.
     */
    static bookmarkedPath(name: string): string | null
    /**
     * Whether path refers to a file.
     */
    static isFile(path: string): Promise<boolean>
    static isFileSync(path: string): boolean
    /**
     * Whether path refers to a directory.
     */
    static isDirectory(path: string): Promise<boolean>
    static isDirectorySync(path: string): boolean
    static isLink(path: string): Promise<boolean>
    static isLinkSync(path: string): boolean

    static isBinaryFileSync(path: string): boolean
    static isBinaryFile(path: string): Promise<boolean>
    /**
     * Reads the entire file contents as a string using the given `Encoding`.
     * @param path The path of the file
     * @param encoding
     * @returns String contents.
     */
    static readAsString(path: string, encoding?: Encoding): Promise<string>
    static readAsStringSync(path: string, encoding?: Encoding): string
    /**
     * Reads the entire file contents as a Uint8Array.
     * @param path The path of the file
     */
    static readAsBytes(path: string): Promise<Uint8Array>
    static readAsBytesSync(path: string): Uint8Array
    /**
     * Reads the entire file contents as a Data object.
     * @param path The path of the file
     */
    static readAsData(path: string): Promise<Data>
    static readAsDataSync(path: string): Data
    /**
     * Writes a string to a file.
     * @param path The path of the file
     * @param contents String contents.
     * @param encoding
     */
    static writeAsString(path: string, contents: string, encoding?: Encoding): Promise<void>
    static writeAsStringSync(path: string, contents: string, encoding?: Encoding): void
    /**
     *  Writes a Uint8Array data to a file.
     * @param path The path of the file
     * @param data A `Uint8Array` object.
     */
    static writeAsBytes(path: string, data: Uint8Array): Promise<void>
    static writeAsBytesSync(path: string, data: Uint8Array): void
    /**
     *  Writes the data to a file.
     * @param path The path of the file
     * @param data A `Data` object.
     */
    static writeAsData(path: string, data: Data): Promise<void>
    static writeAsDataSync(path: string, data: Data): void

    /**
     * Append the given text to a file at the specified file path, creating the file and its directory if they do not already exist. 
     * @param path The file path where the text should be appended.
     * @param text The text content to append.
     * @param encoding The string encoding used to convert `text` into `Data`. Defaults to `.utf8`.
     * @returns A promise that resolve after the operation is successful.
     */
    static appendText(path: string, text: string, encoding?: Encoding): Promise<void>
    static appendTextSync(path: string, text: string, encoding?: Encoding): void

    /**
     * Append the given data to a file at the specified file path, creating the file and its directory if they do not already exist. 
     * @param path The file path where the data should be appended.
     * @param data The data to append.
     * @returns A promise that resolve after the operation is successful.
     */
    static appendData(path: string, data: Data): Promise<void>
    static appendDataSync(path: string, data: Data): void

    /**
     * If `path` is a symbolic link then it is resolved and results for the resulting file are returned.
     * @param path
     * @returns FileStat object
     */
    static stat(path: string): Promise<FileStat>
    static statSync(path: string): FileStat
    /**
     * Moves the file or directory at the specified path to a new location synchronously.
     * @param path The path to the file or directory you want to move.
     * @param newPath The new path for the item in `path`. This path must include the name of the file or directory in its new location.
     */
    static rename(path: string, newPath: string): Promise<void>
    static renameSync(path: string, newPath: string): void
    /**
     * Removes the file or directory at the specified path.
     * @param path A path string indicating the file or directory to remove. If the path specifies a directory, the contents of that directory are recursively removed.
     */
    static remove(path: string): Promise<void>
    static removeSync(path: string): void
    /**
     * Zips the file or directory contents at the specified `srcPath` to the `destPath`.
     * `shouldKeepParent` indicates that the directory name of a source item should be used as root element
     * within the archive. Defaults to `true`.
     *
     * @example
     * ```ts
     * const docsDir = FileManager.documentsDirectory
     *
     * // zip a single file
     * await FileManager.zip(
     *   docsDir + '/test.txt',
     *   docsDir + '/test.zip',
     * )
     *
     * // zip a directory
     * await FileManager.zip(
     *   docsDir + '/MyScript',
     *   docsDir + '/MyScript.zip'
     * )
     * ```
     */
    static zip(srcPath: string, destPath: string, shouldKeepParent?: boolean): Promise<void>
    static zipSync(srcPath: string, destPath: string, shouldKeepParent?: boolean): void
    /**
     * Unzips the contents at the specified `srcPath` to the `destPath`.
     *
     * @example
     * ```ts
     * await FileManager.unzip(
     *   Path.join(FileManager.temporaryDirectory, 'MyScript.zip'),
     *   await FileManager.documentsDirectory
     * )
     * ```
     */
    static unzip(srcPath: string, destPath: string): Promise<void>
    static unzipSync(srcPath: string, destPath: string): void
  }


  /**
   * Share activity item. Supports a text or an image.
   */
  type ActivityItem = string | UIImage

  /**
   * You can share data from your script using this interface.
   */
  declare class ShareSheet {
    /**
     * Present a ShareSheet UI.
     * @param items The array of data on which to perform the activity. You can share text, url, or UIImage.
     * @returns Returns a promise, it is fulfilled with a boolean value indicates that whether the share is completed when the sheet is dismissed.
     */
    static present(items: ActivityItem[]): Promise<boolean>
  }

  /**
   * Parse the QR code image file, or open the scan code page to scan.
   */
  declare class QRCode {
    /**
     * Parse QRCode file.
     * @example
     * ```ts
     * const filePath = (await FileManager.documentsDirectory()) + '/qrcode.png'
     * const result = await QRCode.parse(filePath)
     * if (result != null) {
     *   // handle QRCode result
     * }
     * ```
     */
    static parse(filePath: string): Promise<string | null>
    /**
     * Open the QRCode scan page and scan.
     * @example
     * const result = await QRCode.scan()
     * if (result != null) {
     *   // handle result
     * }
     */
    static scan(): Promise<string | null>
  }

  /**
   * The interface that manages access and changes to the user’s photo library.
   */
  declare class Photos {
    /**
     * Get the latest specified number of photos from the Photos app.
     * @param count The number of photos you want.
     */
    static getLatestPhotos(count: number): Promise<UIImage[] | null>
    /**
     * Present a photo picker dialog and pick limited number of photos.
     * @param count The limited number of photos.
     */
    static pickPhotos(count: number): Promise<UIImage[]>
    /**
     * Take a photo, returns a Promise provides a UIImage  when fulfilled.
     */
    static takePhoto(): Promise<UIImage | null>
    /**
     * Save an image data to the Photos app. Returns a boolean value indicates that whether the operation is successful.
     */
    static savePhoto(image: Data, options?: {
      /**
       * The optional photo name.
       */
      fileName?: string
    }): Promise<boolean>
  }

  type PickFilesOption = {
    /**
     * The initial directory that the document picker displays.
     */
    initialDirectory?: string
    /**
     * An array of uniform type identifiers for the document picker to display.
     * For more information, see [Uniform Type Identifiers.](https://developer.apple.com/documentation/uniformtypeidentifiers/uttype-swift.struct)
     */
    types?: UTType[]
    /**
     * Defaults to true.
     */
    shouldShowFileExtensions?: boolean
    /**
     * Defaults to false.
     */
    allowsMultipleSelection?: boolean
  }

  type ExportFilesOptions = {
    /**
     * The initial directory that the document picker displays.
     */
    initialDirectory?: string

    /**
     * The files for exporting.
     */
    files: {
      /**
       * File data.
       */
      data: Data
      /**
       * File name.
       */
      name: string
    }[]
  }

  /**
   * Type definition for iOS UTType identifiers
   * Reference: https://developer.apple.com/documentation/uniformtypeidentifiers/system_declared_uniform_type_identifiers
   */
  type UTType =
    // Image Types
    | "public.image"                     // Generic image type
    | "public.image.live-photo"          // Live Photo
    | "public.image.raw"                 // RAW image
    | "public.jpeg"                      // JPEG image
    | "public.jpeg-2000"                 // JPEG 2000
    | "public.png"                       // PNG image
    | "public.heic"                      // HEIC image
    | "public.heif"                      // HEIF image
    | "public.gif"                       // GIF image
    | "public.tiff"                      // TIFF image
    | "com.compuserve.gif"               // GIF alias
    | "public.svg-image"                 // SVG image
    | "public.bmp"                       // BMP image
    | "com.microsoft.bmp"                // BMP alias
    | "com.microsoft.ico"                // ICO icon

    // Video Types
    | "public.movie"                     // Generic movie/video type
    | "public.video"                     // Video
    | "public.mpeg-4"                    // MP4 video
    | "public.mpeg"                      // MPEG video
    | "public.avi"                       // AVI video
    | "public.quicktime-movie"           // QuickTime video
    | "com.apple.quicktime-movie"        // QuickTime alias
    | "public.3gpp"                      // 3GPP video
    | "public.3gpp2"                     // 3GPP2 video
    | "com.microsoft.windows-media-wmv"   // WMV video
    | "com.microsoft.windows-media-wm"    // WM video
    | "com.apple.m4v-video"              // M4V video

    // Audio Types
    | "public.audio"                     // Generic audio type
    | "public.mp3"                       // MP3 audio
    | "public.wav"                       // WAV audio
    | "public.m4a"                       // M4A audio
    | "public.aiff"                      // AIFF audio
    | "com.apple.protected-mpeg-4-audio" // Protected audio
    | "com.microsoft.windows-media-wma"   // WMA audio
    | "public.aifc"                      // AIFC audio
    | "public.midi"                      // MIDI audio
    | "com.apple.coreaudio-format"       // Core Audio Format

    // Document Types
    | "public.data"                      // Generic data type
    | "public.text"                      // Text file
    | "public.plain-text"                // Plain text
    | "public.html"                      // HTML file
    | "public.xml"                       // XML file
    | "public.json"                      // JSON file
    | "public.yaml"                      // YAML file
    | "public.rtf"                       // RTF file
    | "public.pdf"                       // PDF file
    | "com.adobe.pdf"                    // Adobe PDF
    | "public.markdown"                  // Markdown file
    | "public.markdown-text"             // Markdown text
    | "public.csv"                       // CSV file
    | "public.source-code"               // Source code
    | "public.swift-source"              // Swift source code
    | "public.objective-c-source"        // Objective-C source code
    | "public.c-source"                  // C source code
    | "public.c-plus-plus-source"        // C++ source code
    | "public.java-source"               // Java source code
    | "public.python-script"             // Python script
    | "public.shell-script"              // Shell script
    | "public.ruby-script"               // Ruby script

    // Archive Types
    | "public.zip-archive"               // ZIP archive
    | "org.gnu.gnu-zip-archive"          // GZIP archive
    | "public.tar-archive"               // TAR archive
    | "org.gnu.gnu-zip-tar-archive"      // GZIP TAR archive
    | "com.pkware.zip-archive"           // PKWare ZIP archive
    | "com.rarlab.rar-archive"           // RAR archive
    | "org.7-zip.7-zip-archive"          // 7ZIP archive

    // Office Document Types
    | "com.microsoft.word.doc"           // Word document
    | "com.microsoft.word.docx"          // Word DOCX document
    | "com.microsoft.excel.xls"          // Excel document
    | "com.microsoft.excel.xlsx"         // Excel XLSX document
    | "com.microsoft.powerpoint.ppt"     // PowerPoint document
    | "com.microsoft.powerpoint.pptx"    // PowerPoint PPTX document
    | "org.openxmlformats.wordprocessingml.document"   // OpenXML Word
    | "org.openxmlformats.spreadsheetml.sheet"         // OpenXML Excel
    | "org.openxmlformats.presentationml.presentation" // OpenXML PowerPoint
    | "org.oasis-open.opendocument.text"              // OpenDocument Text
    | "org.oasis-open.opendocument.spreadsheet"       // OpenDocument Spreadsheet
    | "org.oasis-open.opendocument.presentation"      // OpenDocument Presentation

    // iWork Document Types
    | "com.apple.iwork.pages.pages"     // Pages document
    | "com.apple.iwork.numbers.numbers" // Numbers document
    | "com.apple.iwork.keynote.keynote" // Keynote document

    // System Types
    | "public.folder"                    // Folder
    | "public.directory"                 // Directory
    | "public.symlink"                   // Symbolic link
    | "public.url"                       // URL
    | "public.file-url"                  // File URL
    | "com.apple.application"            // Application
    | "com.apple.application-bundle"     // Application bundle
    | "com.apple.framework"              // Framework
    | "com.apple.package"                // Package
    | "com.apple.resolvable"            // Resolvable
    | "public.executable"                // Executable
    | "public.disk-image"                // Disk image
    | "public.database"                  // Database

    // Font Types
    | "public.font"                      // Font
    | "public.truetype-font"             // TrueType font
    | "public.opentype-font"             // OpenType font
    | "com.adobe.postscript-font"        // PostScript font

    // Graphic Design Types
    | "com.adobe.photoshop-image"        // Photoshop file
    | "com.adobe.illustrator.ai-image"   // Illustrator file
    | "org.webmproject.webp"             // WebP image

    // 3D File Types
    | "public.3d-content"                // 3D content
    | "public.usd"                       // USD file
    | "public.obj"                       // OBJ file
    | "public.stl"                       // STL file

    // Other Types
    | "public.content"                   // Generic content
    | "public.composite-content"         // Composite content
    | "public.archive"                   // Archive
    | "public.item"                      // Item
    | "public.contact"                   // Contact
    | "public.message"                   // Message
    | "public.calendar-event"            // Calendar event
    | "public.log"                       // Log


  /**
   * Pick files from Files app.
   */
  declare class DocumentPicker {
    /**
     * Pick files from documents.
     * @example
     * ```ts
     * async function run() {
     *   const imageFilePath = await DocumentPicker.pickFiles()
     *   if (imageFilePath != null) {
     *     // ...
     *   }
     * }
     * run()
     * ```
     */
    static pickFiles(options?: PickFilesOption): Promise<string[]>
    /**
     * Pick a directory.
     * @param initialDirectory The initial directory that the document picker displays.
     * @example
     * ```ts
     * const selectedDirectory = await DocumentPicker.pickDirectory()
     * if (selectedDirectory == null) {
     *   // user canceled the picker
     * }
     * ```
     */
    static pickDirectory(initialDirectory?: string): Promise<string | null>
    /**
     * Exports files.
     * @example
     * ```ts
     * async function run() {
     *   const textContent = "Hello Scripting!"
     *   const result = await DocumentPicker.exportFiles({
     *     files: [
     *       {
     *         data: Data.fromString(textContent)!,
     *         name: 'greeting.txt',
     *       }
     *     ]
     *   })
     *
     *   if (result.length > 0) {
     *     console.log('Exported files: ', result)
     *   }
     * }
     * run()
     * ```
     */
    static exportFiles(options: ExportFilesOptions): Promise<string[]>
    /**
     * When you no longer need access to the files or directories those pick by `DocumentPicker` and automatic make the resource available to your script, such as one returned by resolving a security-scoped bookmark, call this method to relinquish access.
     */
    static stopAcessingSecurityScopedResources(): void
  }

  /**
   * Providing a persistent store for simple data.
   *
   * Data is persisted to disk asynchronously.
   *
   * The follow data types are supported:
   *  - `string`
   *  - `number`
   *  - `boolean`
   *  - `JSON`
   *  - `Data` (use `setData` or `getData` methods)
   */
  declare class Storage {
    /**
     * Saves a `value` to persistent storage in the background.
     * @returns A boolean indicates whether the operation was successful.
     */
    static set<T>(key: string, value: T): boolean
    /**
     * Reads a value from persistent storage, if the value of the key is not exists, returns `null`.
     */
    static get<T>(key: string): T | null
    /**
     * Saves a `Data` to persistent storage in the background.
     */
    static setData(key: string, data: Data): void
    /**
     * Reads a `Data` from persistent storage, if the value of the key is not exists, returns `null`.
     */
    static getData(key: string): Data | null
    /**
     * Removes an entry from persistent storage.
     */
    static remove(key: string): void
    /**
     * Returns true if the persistent storage contains the given `key`.
     */
    static contains(key: string): boolean
  }

  /**
   * An object that displays interactive web content, such as for an in-app browser.
   */
  declare class WebViewController {
    /**
     * When the web view performs a request to load a resource, the function can determine whether or not to allow the request. 
     */
    shouldAllowRequest?: (request: {
      /**
       * The URL of the request.
       */
      url: string
      /**
       * The HTTP request method.
       */
      method: string
      /**
       * The data sent as the message body of a request, such as for an HTTP POST request.
       */
      body?: Data | null
      /**
       * A dictionary containing all of the HTTP header fields for a request.
       */
      headers: Record<string, string>
      /**
       * The timeout interval of the request.
       */
      timeoutInterval: number
      /**
       * The type of action that triggered the navigation.
       */
      navigationType: "linkActivated" | "reload" | "backForward" | "formResubmitted" | "formSubmitted" |  "other"
    }) => Promise<boolean>
    /**
     * Load a webpage by a URL string, returns a Promise with boolean value indicates that whether the load request is completed.
     * @param url URL string.
     */
    loadURL(url: string): Promise<boolean>
    /**
     * Loads the contents of the specified HTML string and navigates to it. Returns a Promise with boolean value indicates that whether the load request is completed.
     * @param html HTML string.
     * @param baseURL A URL that you use to resolve relative URLs within the document.
     */
    loadHTML(html: string, baseURL?: string): Promise<boolean>
    /**
     * Load a content by the data, you must provide the mimeType, encoding string and baseURL parameters. Returns a Promise with boolean value indicates that whether the load request is completed.
     * @param data The data to use as the contents of the webpage.
     * @param mimeType The MIME type of the information in the data parameter. This parameter must not contain an empty string.
     * @param encoding The data's character encoding name.
     * @param baseURL A URL that you use to resolve relative URLs within the document.
     */
    loadData(data: Data, mimeType: string, encoding: string, baseURL: string): Promise<boolean>
    /**
     * Wait for the WebView load completed, returns a Promise that resolves a boolean value indicates that whether it is successful.
     */
    waitForLoad(): Promise<boolean>
    /**
     * Get current HTML content of the webpage, you must call this method after the website is loaded completed.
     */
    getHTML(): Promise<string | null>
    /**
     * Evaluates the specified JavaScript string.
     * @param javascript JavaScript string.
     */
    evaluateJavaScript<T = any>(javascript: string): Promise<T>
    /**
     * Installs a message handler that returns a reply to your JavaScript code.
     * @param name The name of the message handler. This parameter must be unique within the user content controller and must not be an empty string.
     * @param handler The message handler, you can return a value for replying the WebView.
     * @example
     * ```ts
     * let webView = new WebViewController()
     * webView.addScriptMessageHandler("sayHi", (greeting: string) => {
     *   console.log("Receive a message", greeting)
     * 
     *   return "Hello!"
     * })
     * 
     * // ... load the WebView
     * 
     * let result = await webView.evaluateJavaScript("window.webkit.messageHandlers.sayHi.postMessage('Hi!')")
     * console.log(result) // "Hello!"
     * ```
     */
    addScriptMessageHandler<P = any, R = any>(name: string, handler: (params?: P) => R)
    /**
     * Present the WebView, returns a Promise that is resolved after the WebView is dismissed. If this WebViewController is used for the WebView view, this operation will be failure. And if this controller is presented, it can no longer use for WebView view.
     * @param fullscreen Whether present the WebView in fullscreen. Defaults to false.
     * @param navigationTitle Set the navigation title.
     */
    present(options?: {
      fullscreen?: boolean
      navigationTitle?: string
    }): Promise<void>
    /**
     * Check whether there is a valid back item in the back-forward list.
     */
    canGoBack(): Promise<boolean>
    /**
     * Check whether there is a valid forward item in the back-forward list.
     */
    canGoForward(): Promise<boolean>
    /**
     * Navigates to the back item in the back-forward list. Returns a Promise fulfills a boolean value indicates whether go back successfully.
     */
    goBack(): Promise<boolean>
    /**
     * Navigates to the forward item in the back-forward list. Returns a Promise fulfills a boolean value indicates whether go forward successfully.
     */
    goForward(): Promise<boolean>
    /**
     * Reloads the current webpage.
     */
    reload(): Promise<void>
    /**
     * Dismiss the WebView, if the WebView is not presented, do nothing. You can presented the WebView again before it was disposed.
     */
    dismiss(): void
    /**
     * Dispose the WebView controller. If the WebView is presented, it will be dismissed. You must call this method manually to avoid memory leaks.
     */
    dispose(): void
  }

  /**
   * The frequency for recurrence rules.
   */
  type RecurrenceFrequency = "daily" | "weekly" | "monthly" | "yearly"

  /**
   * The day of the week.
   */
  type RecurrenceWeekday =
    | "sunday"
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"


  /**
   * The type that represents the day of the week.
   */
  type RecurrenceDayOfWeek = RecurrenceWeekday | {
    weekday: RecurrenceWeekday
    weekNumber: number
  }

  /**
   * A class that defines the end of a recurrence rule.
   */
  declare class RecurrenceEnd {
    /**
     * Initializes and returns a count-based recurrence end with a given maximum occurrence count.
     */
    static fromCount(count: number): RecurrenceEnd
    /**
     * Initializes and returns a date-based recurrence end with a given end date.
     */
    static fromDate(date: Date): RecurrenceEnd
  }

  /**
   * A class that describes the pattern for a recurring event.
   */
  declare class RecurrenceRule {
    /**
     * The identifier for the recurrence rule’s calendar.
     */
    readonly identifier: string
    /**
     * Indicates when the recurrence rule ends.
     */
    readonly recurrenceEnd?: RecurrenceEnd
    /**
     * The frequency of the recurrence rule.
     */
    readonly frequency: RecurrenceFrequency
    /**
     * Specifies how often the recurrence rule repeats over the unit of time indicated by its frequency.
     */
    readonly interval: number
    /**
     * Indicates which day of the week the recurrence rule treats as the first day of the week.
     */
    readonly firstDayOfTheWeek: number

    /**
     * The days of the week associated with the recurrence rule, as an array of `RecurrenceDayOfWeek` objects.
     */
    readonly daysOfTheWeek?: RecurrenceDayOfWeek[]

    /**
     * The days of the month associated with the recurrence rule, as an array of numbers.
     */
    readonly daysOfTheMonth?: number[]

    /**
     * The days of the year associated with the recurrence rule, as an array of numbers.
     */
    readonly daysOfTheYear?: number[]

    /**
     * The weeks of the year associated with the recurrence rule, as an array of numbers.
     */
    readonly weeksOfTheYear?: number[]

    /**
     * The months of the year associated with the recurrence rule, as an array of numbers.
     */
    readonly monthsOfTheYear?: number[]

    /**
     * An array of ordinal numbers that filters which recurrences to include in the recurrence rule’s frequency.
     */
    readonly setPositions?: number[]

    /**
     * Create a RecurrenceRule instance from sepcified options.
     */
    static create(options: {
      /**
       * The frequency of the recurrence rule. Can be daily, weekly, monthly, or yearly.
       */
      frequency: RecurrenceFrequency
      /**
       * The interval between instances of this recurrence. For example, a weekly recurrence rule with an interval of 2 occurs every other week. Must be greater than 0.
       */
      interval: number
      /**
       * The days of the week that the event occurs, as an array of `RecurrenceDayOfWeek` objects.
       */
      daysOfTheWeek?: RecurrenceDayOfWeek[]
      /**
       * The days of the month that the event occurs, as an array of numbers. Values can be from 1 to 31 and from -1 to -31. This parameter is only valid for recurrence rules of type `monthly`.
       */
      daysOfTheMonth?: number[]
      /**
       * The months of the year that the event occurs, as an array of numbers. Values can be from 1 to 12. This parameter is only valid for recurrence rules of type `yearly`.
       */
      monthsOfTheYear?: number[]
      /**
       * The weeks of the year that the event occurs, as an array of numbers. Values can be from 1 to 53 and from -1 to -53. This parameter is only valid for recurrence rules of type `yearly`.
       */
      weeksOfTheYear?: number[]
      /**
       * The days of the year that the event occurs, as an array of numbers. Values can be from 1 to 366 and from -1 to -366. This parameter is only valid for recurrence rules of type `yearly`.
       */
      daysOfTheYear?: number[]
      /**
       * An array of ordinal numbers that filters which recurrences to include in the recurrence rule’s frequency. 
       * 
       * For example, a yearly recurrence rule that has a `daysOfTheWeek` value that specifies Monday through Friday, and a setPositions array containing 2 and -1, occurs only on the second weekday and last weekday of every year. Values can be from 1 to 366 and from -1 to -366.
       * 
       * Negative values indicate counting backwards from the end of the recurrence rule’s frequency (week, month, or year).
       */
      setPositions?: number[]
      /**
       * The end of the recurrence rule.
       */
      end?: RecurrenceEnd
    }): RecurrenceRule | null
  }

  /**
   * Possible calendar types.
   */
  type CalendarType =
    | "birthday"
    | "calDAV"
    | "exchange"
    | "local"
    | "subscription"

  /**
   * The type of calendar source object.
   */
  type CalendarSourceType =
    | "birthdays"
    | "calDAV"
    | "exchange"
    | "local"
    | "mobileMe"
    | "subscribed"

  /**
   * A type indicating the event availability settings that the calendar can support.
   */
  type CalendarEventAvailability =
    | "busy"
    | "free"
    | "tentative"
    | "unavailable"

  type CalendarEntityType =
    | "event"
    | "reminder"

  declare class CalendarSource {
    /**
     * The source type representing the account to which this calendar belongs.
     */
    readonly type: CalendarSourceType
    /**
     * The source identifier.
     */
    readonly identifier: string
    /**
     * The source title.
     */
    readonly title: string
    /**
     * Get the calendars that belong to this source.
     * @param entityType The entity type that this source may support.
     * @returns A promise that resolves to an array of calendars that belong to this source.
     */
    getCalendars(entityType: CalendarEntityType): Promise<Calendar[]>
  }
  /**
   * The `Calendar` API allows you to interact with iOS calendars, enabling operations like retrieving default calendars, creating custom calendars, and managing calendar settings and events.
   */
  declare class Calendar {
    /**
     * A unique identifier for the calendar.
     */
    readonly identifier: string
    /**
     * The calendar’s title.
     */
    title: string
    /**
     * The calendar’s color.
     */
    color: Color
    /**
     * The calendar’s type.
     */
    readonly type: CalendarType

    /**
     * The calendar’s source.
     */
    readonly source: CalendarSource
    /**
     * The entity types this calendar can contain, `event` or `reminder`.
     */
    readonly allowedEntityTypes: CalendarEntityType
    /**
     * Whether this calendar is for events.
     */
    readonly isForEvents: boolean
    /**
     * Whether this calendar is for reminders.
     */
    readonly isForReminders: boolean
    /**
     * A Boolean value that indicates whether you can add, edit, and delete items in the calendar.
     */
    readonly allowsContentModifications: boolean
    /**
     * A Boolean value indicating whether the calendar is a subscribed calendar.
     */
    readonly isSubscribed: boolean
    /**
     * The event availability settings supported by this calendar.
     */
    readonly supportedEventAvailabilities: CalendarEventAvailability
    /**
     * Remove the calendar.
     */
    remove(): Promise<void>
    /**
     * Save the calendar.
     */
    save(): Promise<void>
    /**
     * Get calendar accounts.
     */
    static getSources(): CalendarSource[]
    /**
     * Get the calendar that events are added to by default, as specified by user settings.
     */
    static defaultForEvents(): Promise<Calendar | null>
    /**
     * Identifies the default calendar for adding reminders to, as specified by user settings.
     */
    static defaultForReminders(): Promise<Calendar | null>
    /**
     * Identifies the calendars that support events.
     */
    static forEvents(): Promise<Calendar[]>
    /**
     * Identifies the calendars that support reminders.
     */
    static forReminders(): Promise<Calendar[]>
    /**
     * Create a Calendar by specified options.
     * `sourceIdentifier` and `sourceType` are optional, if you don't provide them, the calendar will be created in the default source.
     * @param options The options for creating a calendar.
     * @param options.title The calendar’s title.
     * @param options.entityType The entity type that this calendar may support.
     * @param options.sourceIdentifier The source identifier representing the account to which this calendar belongs.
     * @param options.sourceType The source type representing the account to which this calendar belongs.
     * @param options.color The calendar’s color.
     * @returns A promise that resolves to the created calendar.
     */
    static create(options: {
      title: string
      entityType: CalendarEntityType
      sourceIdentifier?: string
      sourceType?: CalendarSourceType
      color?: Color
    }): Promise<Calendar>
    /**
     * Present a calendar chooser view.
     * @param allowMultipleSelection Defaults to false.
     */
    static presentChooser(allowMultipleSelection?: boolean): Promise<Calendar[]>
  }

  /**
   * The `Reminder` API allows you to create, edit, and manage reminders in a calendar. This includes setting titles, due dates, priorities, and recurrence rules.
   */
  declare class Reminder {
    /**
     * Construct a Reminder instance.
     */
    constructor(): Reminder
    /**
     * A unique identifier for the reminder.
     */
    readonly identifier: string
    /**
     * The calendar for the reminder.
     */
    calendar: Calendar
    /**
     * The title of the reminder.
     */
    title: string
    /**
     * The notes of the reminder.
     */
    notes?: string
    /**
     * A Boolean value determining whether or not the reminder is marked completed.
     * Setting this property to true will set `completionDate` to the current date; setting this property to false will set `completionDate` to null.
     * 
     * Special Considerations: 
     * If the reminder was completed using a different client, you may encounter the case where this property is true, but `completionDate` is null.
     */
    isCompleted: boolean
    /**
     * The reminder's priority.
     */
    priority: number
    /**
     * The date on which the reminder was completed. Setting this property to a date will set `isCompleted` to true; setting this property to null will set completed to false.
     */
    completionDate?: Date
    /**
     * The date by which the reminder should be completed.
     */
    dueDate?: Date
    /**
     * Whether the `dueDate` includes a time.
     * 
     * When this is true, assignments to the dueDate property will include a time, when this is false, the time component of the date will be ignored. Defaults to true.
     */
    dueDateIncludesTime: boolean
    /**
     * The recurrence rules for the reminder.
     */
    recurrenceRules?: RecurrenceRule[]
    /**
     * A Boolean value that indicates whether the reminder has recurrence rules.
     */
    readonly hasRecurrenceRules: boolean
    /**
     * Adds a recurrence rule to the recurrence rule array.
     */
    addRecurrenceRule(rule: RecurrenceRule)
    /**
     * Removes a recurrence rule from the recurrence rule array.
     */
    removeRecurrenceRule(rule: RecurrenceRule)
    /**
     * Removes the reminder from the calendar.
     */
    remove(): Promise<void>
    /**
     * Saves changes to a reminder.
     */
    save(): Promise<void>
    /**
     * Get all reminders. 
     */
    static getAll(calenders?: Calendar[]): Promise<Reminder[]>
    /**
     * Get all incompelte reminders.
     */
    static getIncompletes(options?: {
      /**
       * The start date of the range of reminders fetched, or null for all incomplete reminders before endDate.
       */
      startDate?: Date
      /**
       * The end date of the range of reminders fetched, or null for all incomplete reminders after startDate.
       */
      endDate?: Date
      /**
       * An array of calendars to search.
       */
      calendars?: Calendar[]
    }): Promise<Reminder[]>
    /**
     * Get all completed reminders.
     */
    static getCompleteds(options?: {
      /**
       * The start date of the range of reminders fetched, or null for all completed reminders before endDate.
       */
      startDate?: Date
      /**
       * The end date of the range of reminders fetched, or null for all completed reminders after startDate.
       */
      endDate?: Date
      /**
       * An array of calendars to search.
       */
      calendars?: Calendar[]
    }): Promise<Reminder[]>
  }

  /**
   * A object that represents person, group, or room invited to a calendar event.
   */
  type EventParticipant = {
    /**
     * A Boolean value indicating whether this participant represents the owner of this account.
     */
    isCurrentUser: boolean
    /**
     * The participant’s name.
     */
    name?: string
    /**
     * The participant’s role in the event.
     */
    role: ParticipantRole
    /**
     * The participant’s type.
     */
    type: ParticipantType
    /**
     * The participant’s attendance status.
     */
    status: ParticipantStatus
  }

  /**
   * The participant’s role for an event.
   */
  type ParticipantRole =
    | "chair"
    | "nonParticipant"
    | "optional"
    | "required"
    | "unknown"

  /**
   * The type of participant.
   */
  type ParticipantType =
    | "group"
    | "person"
    | "resource"
    | "room"
    | "unknown"

  /**
   * The participant’s attendance status for an event.
   */
  type ParticipantStatus =
    | "unknown"
    | "pending"
    | "accepted"
    | "declined"
    | "tentative"
    | "delegated"
    | "completed"
    | "inProcess"

  /**
   * The action taken by the user after editing an event.
   */
  type EventEditViewAction = "deleted" | "saved" | "canceled"
  /**
   * The `CalendarEvent` API enables you to create and manage events in iOS calendars, with properties like title, location, dates, attendees, and recurrence.
   */
  declare class CalendarEvent {
    /**
     * A unique identifier for the event.
     */
    readonly identifier: string
    /**
     * The calendar for the event. This property cannot be set to null.
     * If you want to remove the event from the calendar, use the `remove` method.
     */
    calendar: Calendar | null
    /**
     * The title for the event.
     */
    title: string
    /**
     * The notes for the event.
     */
    notes?: string
    /**
     * The URL string for the event.
     */
    url?: string
    /**
     * A Boolean value that indicates whether the event is an all-day event.
     */
    isAllDay: boolean
    /**
     * The start date of the event.
     */
    startDate: Date
    /**
     * The end date for the event.
     */
    endDate: Date
    /**
     * The location associated with the calendar item.
     */
    location?: string
    /**
     * The time zone for the 
     */
    timeZone?: string
    /**
     * The attendees associated with the event, as an array of `EventParticipant` objects.
     */
    readonly attendees?: EventParticipant[]
    /**
     * The recurrence rules for the event.
     */
    recurrenceRules?: RecurrenceRule[]
    /**
     * A Boolean value that indicates whether the event has recurrence rules.
     */
    readonly hasRecurrenceRules: boolean
    constructor(): CalendarEvent
    /**
     * Adds a recurrence rule to the recurrence rule array.
     */
    addRecurrenceRule(rule: RecurrenceRule)
    /**
     * Removes a recurrence rule from the recurrence rule array.
     */
    removeRecurrenceRule(rule: RecurrenceRule)
    /**
     * Removes an event or recurring events from the calendar.
     */
    remove(): Promise<void>
    /**
     * Saves an event or recurring events to the calendar.
     */
    save(): Promise<void>
    /**
     * Present a edit view for editing the calendar event. Returns a promise provides the edit view action when fulfilled.
     */
    presentEditView(): Promise<EventEditViewAction>
    /**
     * To identify events that occur within a given date range and calendars.
     * @param startDate The start date of the range of events fetched.
     * @param endDate The end date of the range of events fetched.
     * @param calendars An array of calendars to search, or null to search all calendars.
     */
    static getAll(startDate: Date, endDate: Date, calendars?: Calendar[]): Promise<CalendarEvent[]>
    /**
     * Present a view for creating new calendar event. Returns a promise provides the saved calendar event when fulfilled.
     */
    static presentCreateView(): Promise<CalendarEvent | null>
  }

  /**
   * The WebSocket object provides the API for creating and managing a WebSocket connection to a server, as well as for sending and receiving data on the connection.
   */
  declare class WebSocket {
    /**
     * The WebSocket() constructor returns a new WebSocket object and immediately attempts to establish a connection to the specified WebSocket URL.
     */
    constructor(url: string): WebSocket
    readonly url: string
    onopen?: () => void
    onerror?: (error: Error) => void
    onmessage?: (message: string | Data) => void
    onclose?: (reason?: string) => void
    /**
     * Enqueues the specified data to be transmitted to the server over the WebSocket connection.
     */
    send(message: string | Data): void
    /**
     * Closes the WebSocket connection or connection attempt, if any. If the connection is already CLOSED, this method does nothing.
     * @param code An integer [WebSocket connection close code](https://www.rfc-editor.org/rfc/rfc6455.html#section-7.4.1) value indicating a reason for closure.
     * @param reason A string providing a custom [WebSocket connection close reason](https://www.rfc-editor.org/rfc/rfc6455.html#section-7.1.6) (a concise human-readable prose explanation for the closure). The value must be no longer than 123 bytes (encoded in UTF-8).
     */
    close(code?: 1000 | 1001 | 1002 | 1003, reason?: string): void
    addEventListener(event: "open", listener: () => void): void
    addEventListener(event: "error", listener: (error: Error) => void): void
    addEventListener(event: "message", listener: (message: string | Data) => void)
    addEventListener(event: "close", listener: (reason?: string) => void)
    removeEventListener(event: "open", listener: () => void): void
    removeEventListener(event: "error", listener: (error: Error) => void): void
    removeEventListener(event: "message", listener: (message: string | Data) => void)
    removeEventListener(event: "close", listener: (reason?: string) => void)
  }

  type DurationInSeconds = number

  /**
   * The shared audio session instance.
   * An audio session acts as an intermediary between your app and the operating system — and, in turn, the underlying audio hardware.
   */
  declare class SharedAudioSession {
    /**
     * Get session category.
     * An audio session category defines a set of audio behaviors for your app. The default category assigned to an audio session is soloAmbient.
     */
    static get category(): Promise<AudioSessionCategory>
    /**
     * The set of options associated with the current audio session category.
     * You use category options to tailor the behavior of the active audio session category. See `AudioSessionCategoryOptions` for the supported values.
     */
    static get categoryOptions(): Promise<AudioSessionCategoryOptions[]>
    /**
     * The current audio session’s mode.
     * The audio session mode, together with the audio session category, indicates to the system how you intend to use audio in your app. You can use a mode to configure the audio system for specific use cases such as video recording, voice or video chat, or audio analysis.
     * `AudioSessionMode` discusses the values available for this property. The default value is `default`.
     */
    static get mode(): Promise<AudioSessionMode>
    /**
     * The preferred sample rate, in hertz.
     */
    static get preferredSampleRate(): Promise<number>
    /**
     * This property returns true if any other audio is playing, including audio from an app using the ambient category. Most apps should instead use the `secondaryAudioShouldBeSilencedHint` property, because it’s more restrictive when considering whether primary audio from another app is playing.
     */
    static get isOtherAudioPlaying(): Promise<boolean>
    /**
     * A Boolean value that indicates whether another app, with a nonmixable audio session, is playing audio.
     * Use this property as a hint to silence audio that’s secondary to the functionality of the app. For example, in a game that uses the ambient category, you can use this property to mute the soundtrack while leaving sound effects unmuted.
     */
    static get secondaryAudioShouldBeSilencedHint(): Promise<boolean>
    /**
     * A Boolean value that indicates a preference for not interrupting the session with system alerts.
     */
    static get prefersNoInterruptionsFromSystemAlerts(): Promise<boolean>
    /**
     * Not every device supports every audio session category. For instance, the record category isn’t available on a device that doesn’t support audio input.
     * Query this property to determine if the category you’d like to use is available on the current device.
     */
    static get availableCategories(): Promise<AudioSessionCategory[]>
    /**
     * Not every device supports every audio session mode. For example, the videoRecording mode isn’t available on a device that doesn’t support video recording.
     * Query this property to determine if the mode you’d like to use is available on the current device.
     */
    static get availableModes(): Promise<AudioSessionMode[]>
    /**
     * A boolean value that indicates whether system sounds and haptics play while recording from audio input.
     */
    static get allowHapticsAndSystemSoundsDuringRecording(): Promise<boolean>
    /**
     * Activates or deactivates the shared audio session.
     */
    static setActive(active: boolean): Promise<void>
    /**
     * Sets the audio session’s category with the specified options.
     * @param category The category to apply to the audio session.
     * @param options A mask of additional options for handling audio.
     */
    static setCategory(category: AudioSessionCategory, options: AudioSessionCategoryOptions[]): Promise<void>
    /**
     * Sets the audio session’s mode.
     */
    static setMode(mode: AudioSessionMode): Promise<void>
    /**
     * Sets the preferred sample rate for audio input and output.
     * @param sampleRate The hardware sample rate to use. The available range is device dependent and is typically from 8000 through 48000 hertz.
     */
    static setPreferredSampleRate(sampleRate: number): Promise<void>
    /**
     * The listener is called when an audio interruption occurs.
     */
    static addInterruptionListener(listener: AudioSessionInterruptionListener): void
    static removeInterruptionListener(listener: AudioSessionInterruptionListener): void
    /**
     * Sets a boolean value that indicates whether system sounds and haptics play while recording from audio input.
     */
    static setAllowHapticsAndSystemSoundsDuringRecording(value: boolean): Promise<void>
    /**
     * Sets the preference for not interrupting the audio session with system alerts.
     */
    static setPrefersNoInterruptionsFromSystemAlerts(valiue: boolean): Promise<void>
  }
  /**
  * The type of an audio interruption.
  *  - `began`: A type that indicates that the operating system began interrupting the audio session.
  *  - `ended`: A type that indicates that the operating system ended interrupting the audio session.
  */
  type AudioSessionInterruptionType = 'began' | 'ended' | 'unknown'
  type AudioSessionInterruptionListener = (type: AudioSessionInterruptionType) => void
  /**
  * Audio session mode identifiers.
  *  - `default`: The default audio session mode.
  *  - `gameChat`: A mode that the GameKit framework sets on behalf of an application that uses GameKit’s voice chat service.
  *  - `measurement`: A mode that indicates that your app is performing measurement of audio input or output.
  *  - `moviePlayback`: A mode that indicates that your app is playing back movie content.
  *  - `spokenAudio`: A mode used for continuous spoken audio to pause the audio when another app plays a short audio prompt.
  *  - `videoChat`: A mode that indicates that your app is engaging in online video conferencing.
  *  - `videoRecording`: A mode that indicates that your app is recording a movie.
  *  - `voiceChat`: A mode that indicates that your app is performing two-way voice communication, such as using Voice over Internet Protocol (VoIP).
  *  - `voicePrompt`: A mode that indicates that your app plays audio using text-to-speech.
  */
  type AudioSessionMode = 'default' | 'gameChat' | 'measurement' | 'moviePlayback' | 'spokenAudio' | 'videoChat' | 'videoRecording' | 'voiceChat' | 'voicePrompt'
  /**
  * Constants that specify optional audio behaviors.
  *  - `maxWithOthers`: An option that indicates whether audio from this session mixes with audio from active sessions in other audio apps.
  *  - `duckOthers`: An option that reduces the volume of other audio sessions while audio from this session plays.
  *  - `interruptSpokenAudioAndMixWithOthers`: An option that determines whether to pause spoken audio content from other sessions when your app plays its audio.
  *  - `allowBluetooth`: An option that determines whether Bluetooth hands-free devices appear as available input routes.
  *  - `allowBluetoothA2DP`: An option that determines whether you can stream audio from this session to Bluetooth devices that support the Advanced Audio Distribution Profile (A2DP).
  *  - `allowAirplay`: An option that determines whether you can stream audio from this session to AirPlay devices.
  *  - `defaultToSpeaker`: An option that determines whether audio from the session defaults to the built-in speaker instead of the receiver.
  *  - `overrideMutedMicrophoneInterruption`: An option that indicates whether the system interrupts the audio session when it mutes the built-in microphone.
  */
  type AudioSessionCategoryOptions = 'mixWithOthers' | 'duckOthers' | 'interruptSpokenAudioAndMixWithOthers' | 'allowBluetooth' | 'allowBluetoothA2DP' | 'allowAirPlay' | 'defaultToSpeaker' | 'overrideMutedMicrophoneInterruption'
  /**
  * Audio session category identifiers.
  *  - `ambient`: The category for an app in which sound playback is nonprimary — that is, your app also works with the sound turned off.
  *  - `multiRoute`: The category for routing distinct streams of audio data to different output devices at the same time.
  *  - `playAndRecord`: The category for recording (input) and playback (output) of audio, such as for a Voice over Internet Protocol (VoIP) app.
  *  - `playback`: The category for playing recorded music or other sounds that are central to the successful use of your app.
  *  - `record`: The category for recording audio while also silencing playback audio.
  *  - `soloAmbient`: The default audio session category.
  */
  type AudioSessionCategory = 'ambient' | 'multiRoute' | 'playAndRecord' | 'playback' | 'record' | 'soloAmbient'

  /**
   * Specifies when to pause or stop speech.
   */
  type SpeechBoundary = 'immediate' | 'word'
  /**
   * A distinct voice for use in speech synthesis.
   * See also:
   * * https://developer.apple.com/documentation/avfaudio/avspeechsynthesisvoice
   */
  type SpeechSynthesisVoice = {
    /**
     * The unique identifier of a voice.
     */
    identifier: string
    /**
     * The name of a voice.
     */
    name: string
    /**
     * A BCP 47 code that contains the voice’s language and locale.
     */
    language: string
    /**
     * The speech quality of a voice.
     */
    quality: 'default' | 'premium' | 'enhanced'
    /**
     * The gender for a voice.
     */
    gender: 'male' | 'female' | 'unspecified'
  }
  type SpeechProgressDetails = {
    text: string
    start: number
    end: number
    word: string
  }
  type SpeechSynthesisOptions = {
    /**
     * A boolean value indicates whether the text is a markdown string.
     */
    isMarkdown?: boolean
    /**
     * Set this property to a value within the range of 0.5 for lower pitch to 2.0 for higher pitch. The default value is 1.0.
     * This property will override the `Speech.pitch`.
     */
    pitch?: number
    /**
     * The rate the speech synthesizer uses when speaking the utterance.
     */
    rate?: number
    /**
     * Set this property to a value within the range of 0.0 for silent to 1.0 for loudest volume. The default value is 1.0.
     * This property will override the `Speech.volume`.
     */
    volume?: number
    /**
     * The amount of time the speech synthesizer pauses before speaking the utterance.
     * This property will override the `Speech.preUtteranceDelay`.
     */
    preUtteranceDelay?: number
    /**
     * The amount of time the speech synthesizer pauses after speaking an utterance before handling the next utterance in the queue.
     * This property will override the `Speech.postUtteranceDelay`.
     */
    postUtteranceDelay?: number
    /**
     * Set a voice by identifier.
     * This property will override the value set by calling `Speech.setVoiceByIdentifier` or `Speech.setVoiceByLanguage`.
     */
    voiceIdentifier?: string
    /**
     * Set a voice by language code.
     * This property will override the value set by calling `Speech.setVoiceByIdentifier` or `Speech.setVoiceByLanguage`.
     */
    voiceLanguage?: string
  }
  /**
   * Text To Speech.
   */
  declare class Speech {
    /**
     * The default pitch value.
     * Set this property to a value within the range of 0.5 for lower pitch to 2.0 for higher pitch. The default value is 1.0.
     */
    static pitch: number
    /**
     * The rate the speech synthesizer uses when speaking the utterance.
     * The speech rate is a decimal representation within the range of `Speech.minSpeechRate` and `Speech.maxSpeechRate`. Lower values correspond to slower speech, and higher values correspond to faster speech. The default value is `Speech.defaultSpeechRate`.
     */
    static rate: number
    /**
     * The minimum rate the speech synthesizer uses when speaking an utterance.
     */
    static readonly minSpeechRate: number
    /**
     * The maximum rate the speech synthesizer uses when speaking an utterance.
     */
    static readonly maxSpeechRate: number
    /**
     * The default rate the speech synthesizer uses when speaking an utterance.
     */
    static readonly defaultSpeechRate: number
    /**
     * The default volume value.
     * Set this property to a value within the range of 0.0 for silent to 1.0 for loudest volume. The default value is 1.0.
     */
    static volume: number
    /**
     * The amount of time the speech synthesizer pauses before speaking the utterance.
     * When multiple utterances exist in the queue, the speech synthesizer pauses a minimum amount of time equal to the sum of the current utterance’s postUtteranceDelay and the next utterance’s preUtteranceDelay.
     */
    static preUtteranceDelay: number
    /**
     * The amount of time the speech synthesizer pauses after speaking an utterance before handling the next utterance in the queue.
     * When multiple utterances exist in the queue, the speech synthesizer pauses a minimum amount of time equal to the sum of the current utterance’s postUtteranceDelay and the next utterance’s preUtteranceDelay.
     */
    static postUtteranceDelay: number
    /**
     * Retrieves all available voices on the device.
     */
    static get speechVoices(): Promise<SpeechSynthesisVoice[]>
    /**
     * A string that contains the BCP 47 language and locale code for the user’s current locale.
     */
    static get currentLanguageCode(): Promise<string>

    /**
     * A Boolean value that specifies whether the app manages the audio session.
     * If you set this value to false, the system creates a separate audio session to automatically manage speech, interruptions, and mixing and ducking the speech with other audio sources.
     */
    static usesApplicationAudioSession: boolean
    /**
     * Speak a text, it will add the utterance to the speech synthesizer’s queue.
     */
    static speak(text: string, options?: SpeechSynthesisOptions): Promise<void>
    /**
     * Synthesize text to the file stored in local documents directory.
     * @param text Text to synthesize
     * @param filePath The path of file to be stored.
     * @example
     * ```ts
     * await Speech.synthesizeToFile(
     *   "Hello **World**",
     *   Path.join(FileManager.documentDirectory), "tts.caf"),
     *   {
     *     isMarkdown: true,
     *   }
     * )
     * ```
     */
    static synthesizeToFile(text: string, filePath: string, options?: SpeechSynthesisOptions): Promise<void>
    /**
     * Pauses speech at the boundary you specify.
     * @param at A string that describes whether to pause speech immediately or only after the synthesizer finishes speaking the current word. Defaults to 'immediate'.
     */
    static pause(at?: SpeechBoundary): Promise<boolean>
    /**
     * Resumes speech from its paused point.
     */
    static resume(): Promise<boolean>
    /**
     * Stops speech at the boundary you specify.
     * @param at A string that describes whether to stop speech immediately or only after the synthesizer finishes speaking the current word. Defaults to 'immediate'.
     */
    static stop(at?: SpeechBoundary): Promise<boolean>
    /**
     * A Boolean value that indicates whether the speech synthesizer is speaking or is in a paused state and has utterances to speak.
     */
    static get isSpeaking(): Promise<boolean>
    /**
     * A Boolean value that indicates whether a speech synthesizer is in a paused state.
     * If true, the speech synthesizer is in a paused state after beginning to speak an utterance; otherwise, false.
     */
    static get isPaused(): Promise<boolean>
    /**
     * Set speech voice by identifier.
     */
    static setVoiceByIdentifier(identifier: string): Promise<boolean>
    /**
     * Set speech voice by language.
     */
    static setVoiceByLanguage(language: string): Promise<boolean>
    static addListener(event: 'start', listener: () => void): void
    static addListener(event: 'pause', listener: () => void): void
    static addListener(event: 'continue', listener: () => void): void
    static addListener(event: 'finish', listener: () => void): void
    static addListener(event: 'cancel', listener: () => void): void
    static addListener(event: 'progress', listener: (details: SpeechProgressDetails) => void): void
    static removeListener(event: 'start', listener: () => void): void
    static removeListener(event: 'pause', listener: () => void): void
    static removeListener(event: 'continue', listener: () => void): void
    static removeListener(event: 'finish', listener: () => void): void
    static removeListener(event: 'cancel', listener: () => void): void
    static removeListener(event: 'progress', listener: (details: SpeechProgressDetails) => void): void
  }

  /**
   * The interface for managing the speech recognizer process.
   */
  declare class SpeechRecognition {
    /**
     * Returns the list of locales that are supported by the speech recognizer.
     */
    static get supportedLocales(): string[]
    /**
     * Returns a boolean that indicates whether the recognizer is running.
     */
    static get isRecognizing(): boolean
    /**
     * Start a speech audio buffer recognition request. Return a boolean value that indicates whether the operation was successfully.
     */
    static start(options: {
      /**
       * The locale string representing the language you want to use for speech recognition. For a list of languages supported by the speech recognizer, see `supportedLocales`.
       */
      locale?: string
      /**
       * A boolean value that indicates whether you want intermediate results returned for each utterance.
       */
      partialResults?: boolean
      /**
       * A boolean value that indicates whether to add punctuation to speech recognition results.
       */
      addsPunctuation?: boolean
      /**
       * A boolean value that determines whether a request must keep its audio data on the device.
       */
      requestOnDeviceRecognition?: boolean
      /**
       * A value that indicates the type of speech recognition being performed. Defaults to `unspecified`.
       */
      taskHint?: RecognitionTaskHint
      /**
       * A boolean that indicates whether use the default settings for `SharedAudioSession`. Defaults to true.
       */
      useDefaultAudioSessionSettings?: boolean
      /**
       * The function to call when partial or final results are available, or when an error occurs. If the `partialResults` property is true, this function may be called multiple times to deliver the partial and final results.
       *
       * @param result A `SpeechRecognitionResult` containing the partial or final transcriptions of the audio content.
       */
      onResult: (result: SpeechRecognitionResult) => void
      /**
       * An optional listener that is notified when the sound level of the input changes. Use this to update the UI in response to more or less input.
       */
      onSoundLevelChanged?: (soundLevel: number) => void
    }): Promise<boolean>
    /**
     * Start a request to recognize speech in a recorded audio file.
     */
    static recognizeFile(options: {
      filePath: string
      /**
       * The locale string representing the language you want to use for speech recognition. For a list of languages supported by the speech recognizer, see `supportedLocales`.
       */
      locale?: string
      /**
       * A boolean value that indicates whether you want intermediate results returned for each utterance.
       */
      partialResults?: boolean
      /**
       * A boolean value that indicates whether to add punctuation to speech recognition results.
       */
      addsPunctuation?: boolean
      /**
       * A boolean value that determines whether a request must keep its audio data on the device.
       */
      requestOnDeviceRecognition?: boolean
      /**
       * A value that indicates the type of speech recognition being performed. Defaults to `unspecified`.
       */
      taskHint?: RecognitionTaskHint
      /**
       * The function to call when partial or final results are available, or when an error occurs. If the `partialResults` property is true, this function may be called multiple times to deliver the partial and final results.
       *
       * @param result A `SpeechRecognitionResult` containing the partial or final transcriptions of the audio content.
       */
      onResult: (result: SpeechRecognitionResult) => void
    }): Promise<boolean>
    /**
     * Stop speech recognition request. Return a boolean value that indicates whether the operation was successfully.
     */
    static stop(): Promise<void>
  }
  /**
  * The type of task for which you are using speech recognition.
  *  - `confirmation`: Use this hint type when you are using speech recognition to handle confirmation commands, such as "yes," "no," or "maybe."
  *  - `dictation`: Use this hint type when you are using speech recognition for a task that's similar to the keyboard's built-in dictation function.
  *  - `search`: Use this hint type when you are using speech recognition to identify search terms.
  *  - `unspecified`: Use this hint type when the intended use for captured speech does not match the other task types.
  */
  type RecognitionTaskHint = 'confirmation' | 'dictation' | 'search' | 'unspecified'
  type SpeechRecognitionResult = {
    /**
     * A boolean value that indicates whether speech recognition is complete and whether the transcriptions are final.
     */
    isFinal: boolean
    /**
     * The entire transcription of utterances, formatted into a single, user-displayable string,  with the highest confidence level.
     */
    text: string
  }

  type MediaItem = {
    /**
     * The title or name of the media item.
     */
    title: string
    /**
     * The performing artists for a media item — which may vary from the primary artist for the album that a media item belongs to.
     */
    artist?: string
    /**
     * The artwork image for the media item.
     */
    artwork?: UIImage
    /**
     * The track number of the media item, for a media item that is part of an album.
     */
    albumTrackNumber?: number
    /**
     * The number of tracks for the album that contains the media item.
     */
    albumTrackCount?: number
    /**
     * The key for the persistent identifier for the media item.
     */
    persistentID?: number
    /**
     * The media type of the media item.
     */
    mediaType?: 'music' | 'podcast' | 'audioBook' | 'anyAudio' | 'movie' | 'tvShow' | 'audioITunesU' | 'videoPodcast' | 'musicVideo' | 'videoITunesU' | 'homeVideo' | 'anyVideo' | 'any'
    /**
     * The music or film genre of the media item.
     */
    genre?: string
    /**
     * The disc number of the media item, for a media item that is part of a multidisc album.
     */
    discNumber?: number
    /**
     * The number of discs for the album that contains the media item.
     */
    discCount?: number
    /**
     * The musical composer for the media item.
     */
    composer?: string
    /**
     * The playback duration of the media item.
     */
    playbackDuration?: DurationInSeconds
    /**
     * The title of an album.
     */
    albumTitle?: string
  }

  /**
   * The commands that respond to remote control events sent by external accessories and system controls.
   *  - `play`: The command for starting playback of the current item.
   *  - `pause`: The command for pausing playback of the current item.
   *  - `stop`: The command for stopping playback of the current item.
   *  - `togglePausePlay`: The command for toggling between playing and pausing the current item.
   *  - `nextTrack`: The command for selecting the next track.
   *  - `previousTrack: The command for selecting the previous track.
   *  - `changeRepeatMode`: The command for changing the repeat mode.
   *  - `changeShuffleMode`: The command for changing the shuffle mode.
   *  - `changePlaybackRate`: The command for changing the playback rate of the current media item.
   *  - `seekBackward`: The command for seeking backward through a single media item.
   *  - `seekForward`: The command for seeking forward through a single media item.
   *  - `skipBackward`: The command for playing a previous point in a media item.
   *  - `skipForward`: The command for playing a future point in a media item.
   *  - `changePlaybackPosition`: The command for changing the playback position in a media item.
   *  - `rating`: The command for rating a media item.
   *  - `like`: The command for indicating that a user likes what is currently playing.
   *  - `dislike`: The command for indicating that a user dislikes what is currently playing.
   *  - `bookmark`: The command for indicating that a user wants to remember a media item.
   *  - `enableLanguageOption`: The command for enabling a language option.
   *  - `disableLanguageOption`: The command for disabling a language option
   */
  type MediaPlayerRemoteCommand =
    | 'pause' | 'play' | 'stop' | 'togglePausePlay'
    | 'nextTrack' | 'previousTrack' | 'changeRepeatMode' | 'changeShuffleMode'
    | 'changePlaybackRate' | 'seekBackward' | 'seekForward' | 'skipBackward' | 'skipForward' | 'changePlaybackPosition'
    | 'rating' | 'like' | 'dislike'
    | 'bookmark'
    | 'enableLanguageOption' | 'disableLanguageOption'

  /**
   * The type of media currently playing.
   */
  enum MediaType {
    audio,
    video,
    none
  }

  type NowPlayingInfo = {
    /**
     * The title or name of the media item.
     */
    title: string
    /**
     * The performing artists for a media item — which may vary from the primary artist for the album that a media item belongs to.
     */
    artist?: string
    /**
     * The artwork image for the media item.
     */
    artwork?: UIImage
    /**
     * The title of an album.
     */
    albumTitle?: string
    /**
     * Defaults to `audio`.
     */
    mediaType?: MediaType
    /**
     * Defaults to 0.
     */
    playbackRate?: number
    /**
     * Defaults to 0.
     */
    elapsedPlaybackTime?: DurationInSeconds
    /**
     * Defaults to 0.
     */
    playbackDuration?: DurationInSeconds
  }

  type MediaPlayerRemoteCommandEvent = {
    /**
     * The time the event occurred.
     */
    timestamp: number
  }

  type MediaPlayerSkipIntervalCommandEvent = MediaPlayerRemoteCommandEvent & {
    /**
     * The chosen interval for this skip command event.
     */
    interval: number
  }

  /**
   * The type of seek command event.
   */
  enum MediaPlayerSeekCommandEventType {
    beginSeeking,
    endSeeking
  }

  type MediaPlayerSeekCommandEvent = MediaPlayerRemoteCommandEvent & {
    /**
     * The type of seek command event, which specifies whether an external player began or ended seeking.
     */
    type: MediaPlayerSeekCommandEventType
  }

  /**
   * An event requesting a change in the rating.
   */
  type MediaPlayerRatingCommandEvent = MediaPlayerRemoteCommandEvent & {
    /**
     * The rating for the command event.
     */
    rating: number
  }

  /**
   * An event requesting a change in the playback rate.
   */
  type MediaPlayerChangePlaybackRateCommandEvent = MediaPlayerRatingCommandEvent & {
    /**
     * The chosen playback rate for the command event.
     */
    playbackRate: number
  }

  /**
   * An event requesting a change in the feedback setting.
   */
  type MediaPlayerFeedbackCommandEvent = MediaPlayerRemoteCommandEvent & {
    /**
     * A Boolean value that indicates whether an app should perform a negative command appropriate to the target.
     */
    isNegative: boolean
  }

  /**
   * An event requesting a change in the playback position.
   */
  type MediaPlayerChangePlaybackPositionCommandEvent = MediaPlayerRemoteCommandEvent & {
    /**
     * The playback position used when setting the current time of the player.
     */
    positionTime: number
  }

  enum MediaPlayerShuffleType {
    off,
    /**
     * Nothing is shuffled during playback.
     */
    items,
    /**
     * Individual items are shuffled during playback.
     */
    collections = 2
  }

  enum MediaPlayerRepeatType {
    off,
    /**
     * Nothing is repeated during playback.
     */
    one,
    /**
     * Repeat a single item indefinitely.
     */
    all,
  }

  type MediaPlayerChangeShuffleModeCommandEvent = MediaPlayerRemoteCommandEvent & {
    /**
     * The desired shuffle type to use when fulfilling the request.
     */
    shuffleType: MediaPlayerShuffleType
    /**
     * Whether or not the selection should be preserved between playback sessions
     */
    preservesShuffleMode: boolean
  }

  type MediaPlayerChangeRepeatModeCommandEvent = MediaPlayerRemoteCommandEvent & {
    /**
     * The desired repeat type to use when fulfilling the request.
     */
    repeatType: MediaPlayerRepeatType
    /**
     * Whether or not the selection should be preserved between playback sessions
     */
    preservesRepeatMode: boolean
  }

  enum MediaPlayerNowPlayingInfoLanguageOptionType {
    audible,
    legible,
  }

  type MediaPlayerNowPlayingInfoLanguageOption = {
    /**
     * The unique identifier for the language option.
     */
    identifier?: string
    /**
     * A boolean value that determines whether to use the best audible language option based on the system preferences.
     */
    isAutomaticLegibleLanguageOption: boolean
    /**
     * A boolean value that determines whether to use the best legible language option based on the system preferences.
     */
    isAutomaticAudibleLanguageOption: boolean
    /**
     * The type of language option.
     */
    languageOptionType: MediaPlayerNowPlayingInfoLanguageOptionType
    /**
     * The abbreviated language code for the language option.
     */
    languageTag?: string
    /**
     * The characteristics that describe the content of the language option.
     */
    languageOptionCharacteristics?: string[]
    /**
     * The display name for a language option.
     */
    displayName?: string
  }

  enum MediaPlayerChangeLanguageOptionSetting {
    none,
    /**
     * No Language Option Change
     */
    nowPlayingItemOnly,
    /**
     * The Language Option change applies only the the now playing item
     */
    permanent,
  }

  type MediaPlayerChangeLanguageOptionCommandEvent = MediaPlayerRemoteCommandEvent & {
    /**
     * The requested language option to change.
     */
    languageOption: MediaPlayerNowPlayingInfoLanguageOption
    /**
     * The extent of the language setting change.
     */
    setting: MediaPlayerChangeLanguageOptionSetting
  }

  enum MediaPlayerPlaybackState {
    unknown,
    /**
     * The app is currently playing a media item.
     */
    playing,
    /**
     * 
     */
    paused,
    /**
     * The app has stopped playing.
     */
    stopped,
    /**
     * The app has been interrupted during playback.
     */
    interrupted,
  }

  /**
   * This interface is used to interact with NowPlayingCenter, display NowPlayingInfo and register commands and related handlers.
   */
  declare const MediaPlayer: {
    /**
     * The current Now Playing information for the default Now Playing info center.
     * To clear the now playing info center dictionary, set it to null.
     */
    nowPlayingInfo: NowPlayingInfo | null
    /**
     * The current playback state of the Scripting app.
     */
    playbackState: MediaPlayerPlaybackState
    /**
     * Providing an array of commands, indicates that the designated elements are enabled so users can interact with them.
     * Other commands not included will be shown as non-interactive in the UI, and your script will not receive these events.
     */
    setAvailableCommands(commands: MediaPlayerRemoteCommand[]): void
    /**
     * Register the command handler, the callback function will be called when a command event was sent to your script.
     */
    commandHandler?: (command: "pause" | "play" | "stop" | "togglePausePlay" | "nextTrack" | "previousTrack", event: MediaPlayerRemoteCommandEvent) => void
    commandHandler?: (command: "like" | "dislike" | "bookmark", event: MediaPlayerFeedbackCommandEvent) => void
    commandHandler?: (command: "seekBackward" | "seekForward", event: MediaPlayerSeekCommandEvent) => void
    commandHandler?: (command: "skipBackward" | "skipForward", event: MediaPlayerSkipIntervalCommandEvent) => void
    commandHandler?: (command: "rating", event: MediaPlayerRatingCommandEvent) => void
    commandHandler?: (command: "changeRepeatMode", event: MediaPlayerChangeRepeatModeCommandEvent) => void
    commandHandler?: (command: "changeShuffleMode", event: MediaPlayerChangeShuffleModeCommandEvent) => void
    commandHandler?: (command: "enableLanguageOption" | "disableLanguageOption", event: MediaPlayerChangeLanguageOptionCommandEvent) => void
  }

  enum TimeControlStatus {
    paused,
    waitingToPlayAtSpecifiedRate,
    playing,
  }

  /**
   * Use for playing audio or video.
   */
  declare class AVPlayer {
    /**
     * Controls the volume of the AVPlayer.
     * Value ranges from `0.0` (muted) to `1.0` (full volume).
     */
    volume: number
    /**
     * The total duration of the media in seconds.
     * Value will be `0` until the media is fully loaded and ready to play.
     */
    duration: DurationInSeconds
    /**
     * The current playback time of the media in seconds.
     * Can be used to get or set the current position of the playback.
     */
    currentTime: DurationInSeconds
    /**
     * Controls the playback rate of the media.
     * Value `1.0` is normal speed, values less than `1.0` slow down playback, and values greater than `1.0` speed up playback.
     */
    rate: number
    /**
     * A value that indicates whether playback is in progress, paused indefinitely, or waiting for network conditions to improve.
     */
    readonly timeControlStatus: TimeControlStatus
    /**
     * Controls how many times the media will loop.
     * Set to `0` for no looping, a positive value for a specific number of loops, or a negative value for infinite looping.
     */
    numberOfLoops: number
    /**
     * Sets the media source for playback.
     * @param filePathOrURL he file path or URL to the media resource. This can be either a local file path or a remote URL.
     * @returns `true` if the media source is set successfully, otherwise `false`.
     */
    setSource(filePathOrURL: string): boolean
    /**
     * Plays the current media.
     * @returns `true` if the media starts playing successfully, otherwise `false`.
     */
    play(): boolean
    /**
     * Pauses the current media playback.
     */
    pause()
    /**
     * Stops the current media playback and resets to the beginning.
     */
    stop()
    /**
     * Releases all resources and removes any observers.
     * Should be called when the player is no longer needed.
     */
    dispose()
    /**
     * Callback that is called when the media is ready to play.
     */
    onReadyToPlay?: () => void
    /**
     * Callback that is called when the timeControlStatus changed.
     */
    onTimeControlStatusChanged?: (status: TimeControlStatus) => void
    /**
     * Callback that is called when the media playback has ended.
     */
    onEnded?: () => void
    /**
     * Callback that is called when an error occurs during playback.
     * The callback receives an error message as an argument.
     */
    onError?: (message: string) => void
  }

  type AudioFormat =
    | "LinearPCM"
    | "MPEG4AAC"
    | "AppleLossless"
    | "AppleIMA4"
    | "iLBC"
    | "ULaw"

  enum AVAudioQuality {
    min = 0,
    low = 32,
    medium = 64,
    high = 96,
    max = 127
  }

  /**
   * A class that records audio data to a file.
   * 
   *  Use an audio recorder to:
   *  - Record audio from the system’s active input device
   *  - Record for a specified duration or until the user stops recording
   *  - Pause and resume a recording
   */
  declare class AudioRecorder {
    /**
     * Creates an audio recorder with settings, it will fail and throw an error if you don't have permission.
     * @param filePath The file system location to record to.
     * @param settins The audio settings to use for the recording.
     */
    static create(filePath: string, settins?: {
      /**
       * An value that represents the format of the audio data.
       */
      format?: AudioFormat
      /**
       * A floating point value that represents the sample rate, in hertz. 8000 to 192000.
       */
      sampleRate?: number
      /**
       * An integer value that represents the number of channels. 1 to 64.
       */
      numberOfChannels?: number
      encoderAudioQuality?: AVAudioQuality
    }): Promise<AudioRecorder>

    /**
     * A boolean indicating whether the recorder is recording.
     */
    readonly isRecording: boolean

    /**
     * The time, in seconds, since the beginning of the recording.
     */
    readonly currentTime: DurationInSeconds

    /**
     * The current time of the host audio device, in seconds.
     */
    readonly deviceCurrentTime: DurationInSeconds

    /**
     * Records audio starting at a specific time for the indicated duration if given.
     * 
     * @example
     * ```ts
     * function startSynchronizedRecording() {
     *     // Create a time offset relative to the current device time.
     *     let timeOffset = recorderOne.deviceCurrentTime + 0.01
     *     
     *     // Synchronize the recording time of both recorders.
     *     recorderOne.record({ atTime: timeOffset })
     *     recorderTwo.record({ atTime: timeOffset })
     * }
     * ```
     */
    record(options?: {
      /**
       * The time at which to start recording, relative to deviceCurrentTime.
       */
      atTime?: DurationInSeconds
      /**
       * The duration of time to record, in seconds.
       */
      duration?: DurationInSeconds
    }): boolean

    /**
     * Pauses an audio recording.
     */
    pause(): void

    /**
     * Stops recording and closes the audio file.
     */
    stop(): void

    /**
     * Deletes a recorded audio file.
     */
    deleteRecording(): boolean

    /**
     * Should be called when the recorder is no longer needed.
     */
    dispose(): void

    /**
     * Callback that is called when recording finish.
     */
    onFinish?: (success: boolean) => void
    /**
     * Callback that is called when ecorder encode error occured.
     */
    onError?: (message: string) => void
  }

  type SocketIOStatus =
    | "connected"
    | "connecting"
    | "disconnected"
    | "notConnected"
    | "unknown"

  type SocketManagerConfig = {
    /**
     * If given, the WebSocket transport will attempt to use compression.
     */
    compress?: boolean
    /**
     * A dictionary of GET parameters that will be included in the connect url.
     */
    connectParams?: Record<string, any>
    /**
     * An array of cookies that will be sent during the initial connection.
     */
    cookies?: {
      name: string
      value: string
      originURL?: string
      version?: string
      domain?: string
      path?: string
      secure?: string
      expires?: string
      comment?: string
      commentURL?: string
      discard?: string
      maximumAge?: string
      port?: string
      sameSitePolicy?: "lax" | "strict"
    }[]
    /**
     * Any extra HTTP headers that should be sent during the initial connection.
     */
    extraHeaders?: Record<string, string>
    /**
     * If passed true, will cause the client to always create a new engine. Useful for debugging, or when you want to be sure no state from previous engines is being carried over.
     */
    forceNew?: boolean
    /**
     * If passed true, the only transport that will be used will be HTTP long-polling.
     */
    forcePolling?: boolean
    /**
     * If passed true, the only transport that will be used will be WebSockets.
     */
    forceWebsockets?: boolean
    /**
     * If passed true, the WebSocket stream will be configured with the enableSOCKSProxy true.
     */
    enableSOCKSProxy?: boolean
    /**
     * A custom path to socket.io. Only use this if the socket.io server is configured to look for this path.
     */
    path?: string
    /**
     * If passed false, the client will not reconnect when it loses connection. Useful if you want full control over when reconnects happen.
     */
    reconnects?: boolean
    /**
     * The number of times to try and reconnect before giving up. Pass -1 to never give up.
     */
    reconnectAttempts?: number
    /**
     * The minimum number of seconds to wait before reconnect attempts.
     */
    reconnectWait?: number
    /**
     * The maximum number of seconds to wait before reconnect attempts.
     */
    reconnectWaitMax?: number
    /**
     * The randomization factor for calculating reconnect jitter.
     */
    randomizationFactor?: number
    /**
     * Set true if your server is using secure transports.
     */
    secure?: boolean
  }

  /**
   * A SocketManager is responsible for multiplexing multiple namespaces through a single SocketEngineSpec.
   * 
   * Example:
   * ```ts
   * let manager = SocketManager("http://localhost:8080/")
   * let defaultNamespaceSocket = manager.defaultSocket
   * let roomASocket = manager.socket("/roomA")
   * 
   * // defaultNamespaceSocket and roomASocket both share a single connection to the server
   * ```
   * Sockets created through the manager are retained by the manager. So at the very least, a single strong reference to the manager must be maintained to keep sockets alive.
   * To disconnect a socket and remove it from the manager, either call `SocketIOClient.disconnect()` on the socket.
   */
  declare class SocketManager {
    constructor(url: string, config?: SocketManagerConfig)

    /**
     * The URL of the socket.io server.
     */
    readonly socketURL: string

    /**
     * The status of this manager.
     */
    readonly status: SocketIOStatus

    readonly config: SocketManagerConfig

    readonly forceNew: boolean

    readonly reconnects: boolean

    readonly reconnectWait: number

    readonly reconnectWaitMax: number

    readonly randomizationFactor: number

    /**
     * The socket associated with the default namespace (”/”).
     */
    readonly defaultSocket: SocketIOClient

    /**
     * Returns a SocketIOClient for the given namespace. This socket shares a transport with the manager.
     */
    socket(namespace: string): SocketIOClient

    /**
     * Sets manager specific configs.
     */
    setConfigs(config: SocketManagerConfig): void

    /**
     * Disconnects the manager and all associated sockets.
     */
    disconnect(): void

    /**
     * Tries to reconnect to the server.
     */
    reconnect(): void
  }

  /**
   * Represents a socket.io-client.
   * 
   * Clients are created through a SocketManager, which owns the SocketEngineSpec that controls the connection to the server.
   * 
   * For example:
   * 
   * ```ts
   * // Create a socket for the "/roomA" namespace
   * let socket = manager.socket("/roomA")
   * 
   * // Add some handlers and connect
   * ```
   */
  declare class SocketIOClient {
    /**
     * The id of this socket.io connect.
     */
    readonly id: string | null
    /**
     * The status of this client.
     */
    readonly status: SocketIOStatus

    connect(): void

    disconnect(): void

    emit(event: string, data: any): void

    on(
      event: "connect" | "disconnect" | "error" | "ping" | "pong" | "reconnect" | "reconnectAttempt" | "statusChange" | "websocketUpgrade",
      callback: (data: any[], ack: (value?: any) => void) => void
    ): void
    on(event: string, callback: (data: any[], ack: (value?: any) => void) => void): void
  }

  type EditorControllerOptions = {
    /**
     * The initial content of the editor.
     */
    content?: string
    /**
     * The extension is used to indicate the file type of the content.
     */
    ext?: "tsx" | "ts" | "js" | "jsx" | "txt" | "md" | "css" | "html" | "json"
    /**
     * The read only state of the editor. Defaults to false.
     */
    readOnly?: boolean
  }

  /**
   * This interface allows you to create an editor controller, access and set editor content, listen for content changes, and display an editor or render it through an `Editor` view.
   */
  declare class EditorController {
    constructor(options?: EditorControllerOptions)
    /**
     * The extension is used to indicate the file type of the content.
     */
    readonly ext: string
    /**
     * The current content of the editor.
     */
    content: string
    /**
     * The content changed callback handler.
     * 
     * It is important to note that when editing in the editor, the onContentChanged callback is not called immediately, but about 100 milliseconds later.
     */
    onContentChanged?: (content: string) => void
    /**
     * Call this method to present the editor, returns a promise that fulfilled when the editor is dismissed.
     * You can call this method again when the editor is dismissed and you havn't call the `dispose` method.
     */
    present(options?: {
      /**
       * You can provide this value to override the value of `Script.name`. When the editor code is running, the default value of `Script.name` is `"Temporary Script"`.
       */
      scriptName?: string
    }): Promise<void>
    /**
     * Dismissing the editor.
     */
    dismiss(): Promise<void>
    /**
     * Release resources. When you no longer need this instance, you must call this method to avoid memory leaks.
     */
    dispose(): void
  }

  /**
   * This interface provides tools to interact with the software keyboard. You can check the visibility of the keyboard, hide it, and listen for changes in its visibility.
   */
  declare module Keyboard {
    /**
     * A read-only property that indicates whether the keyboard is currently visible.
     */
    readonly var visible: boolean

    /**
     * Hides the keyboard if it is currently visible.
     */
    function hide()

    /**
     * Adds a listener function that is called whenever the keyboard's visibility changes.
     */
    function addVisibilityListener(listener: (visible: boolean) => void): void

    /**
     * Removes a previously added visibility listener.
     */
    function removeVisibilityListener(listener: (visible: boolean) => void): void
  }

  type UnitType = {
    value: number
    symbol: string
    formatted: string
  }

  /**
   * Temperature is a comparative measure of thermal energy. The SI unit for temperature is the kelvin (K), which is defined in terms of the triple point of water. Temperature is also commonly measured by degrees of various scales, including Celsius (°C) and Fahrenheit (°F).
   */
  type UnitTemperature = UnitType

  /**
   * Speed is the magnitude of velocity, or the rate of change of position. Speed can be expressed by SI derived units in terms of meters per second (m/s), and is also commonly expressed in terms of kilometers per hour (km/h) and miles per hour (mph).
   */
  type UnitSpeed = UnitType

  /**
   * Length is the dimensional extent of matter. The SI unit for length is the meter (m), which is defined in terms of the distance traveled by light in a vacuum.
   */
  type UnitLength = UnitType

  /**
   * Angle is a quantity of rotation. The SI unit for angle is the radian (rad), which is dimensionless and defined to be the angle subtended by an arc that is equal in length to the radius of a circle. Angle is also commonly expressed in terms of degrees (°) and revolutions (rev).
   */
  type UnitAngle = UnitType

  /**
   * Pressure is the normal force over a surface. The SI unit for pressure is the pascal (Pa), which is derived as one newton of force over one square meter (1 Pa = 1 N / 1 m2).
   */
  type UnitPressure = UnitType

  /**
   * Contains wind data of speed, direction, and gust.
   */
  type WeatherWind = {
    compassDirection: string
    direction: UnitAngle
  }

  type WeatherCondition =
    /**Blizzard. */
    | "blizzard"

    /** Blowing dust or sandstorm. **/
    | "blowingDust"

    /** Blowing or drifting snow. **/
    | "blowingSnow"

    /** Breezy, light wind. **/
    | "breezy"

    /** Clear. **/
    | "clear"

    /** Cloudy, overcast conditions. **/
    | "cloudy"

    /** Drizzle or light rain. **/
    | "drizzle"

    /** Flurries or light snow. **/
    | "flurries"

    /** Fog. **/
    | "foggy"

    /** Freezing drizzle or light rain. **/
    | "freezingDrizzle"

    /** Freezing rain. **/
    | "freezingRain"

    /** Frigid conditions, low temperatures, or ice crystals. **/
    | "frigid"

    /** Hail. **/
    | "hail"

    /** Haze. **/
    | "haze"

    /** Heavy rain. **/
    | "heavyRain"

    /** Heavy snow. **/
    | "heavySnow"

    /** High temperatures. **/
    | "hot"

    /** Hurricane. **/
    | "hurricane"

    /** Thunderstorms covering less than 1/8 of the forecast area. **/
    | "isolatedThunderstorms"

    /** Mostly clear. **/
    | "mostlyClear"

    /** Mostly cloudy. **/
    | "mostlyCloudy"

    /** Partly cloudy. **/
    | "partlyCloudy"

    /** Rain. **/
    | "rain"

    /** Numerous thunderstorms spread across up to 50% of the forecast area. **/
    | "scatteredThunderstorms"

    /** Sleet. **/
    | "sleet"

    /** Smoky. **/
    | "smoky"

    /** Snow. **/
    | "snow"

    /** Notably strong thunderstorms. **/
    | "strongStorms"

    /** Snow flurries with visible sun. **/
    | "sunFlurries"

    /** Rain with visible sun. **/
    | "sunShowers"

    /** Thunderstorms. **/
    | "thunderstorms"

    /** Tropical storm. **/
    | "tropicalStorm"

    /** Windy. **/
    | "windy"

    /** Wintry mix. **/
    | "wintryMix"

  type WeatherPressureTrend =
    /** The pressure is rising. */
    | "rising"

    /** The pressure is falling. */
    | "falling"

    /** The pressure is not changing. */
    | "steady"

  type WeatherUVIndex = {
    value: number
    category: WeatherExposureCategory
  }

  /**
   *  Risk of harm from unprotected sun exposure.
   */
  type WeatherExposureCategory =
    /// The UV index is low.
    ///
    /// The valid values of this property are 0, 1, and 2.
    | "low"

    /// The UV index is moderate.
    ///
    /// The valid values of this property are 3, 4, and 5.
    | "moderate"

    /// The UV index is high.
    ///
    /// The valid values of this property are 6 and 7.
    | "high"

    /// The UV index is very high.
    ///
    /// The valid values of this property are 8, 9, and 10.
    | "veryHigh"

    /// The UV index is extreme.
    ///
    /// The valid values of this property are 11 and higher.
    | "extreme"

  /**
   * An object that provides additional weather information.
   */
  type WeatherMetadata = {
    /**
     * The time of the weather data request.
     */
    date: number
    /**
     * The time the weather data expires.
     */
    expirationDate: number
    /**
     * The location of the request.
     */
    location: LocationInfo
  }

  /**
   * An object that describes the current conditions observed at a location.
   */
  type CurrentWeather = {
    /**
     * The current temperature.
     */
    temperature: UnitTemperature
    /**
     * The feels-like temperature when factoring wind and humidity.
     */
    apparentTemperature: UnitTemperature
    /**
     * The temperature at which relative humidity is 100%.
     */
    dewPoint: UnitTemperature
    /**
     * The percentage of the sky covered with clouds.
     */
    cloudCover: number
    /**
     * The amount of water vapor in the air.
     */
    humidity: number
    /**
     * The sea level air pressure in millibars.
     */
    pressure: UnitPressure
    /**
     * The direction of change of the sea level air pressure.
     */
    pressureTrend: WeatherPressureTrend
    /**
     * The wind speed, direction, and gust.
     */
    wind: Wind
    /**
     * An enumeration value indicating the condition at the time.
     */
    condition: WeatherCondition
    /**
     * The date timestamp of the current weather.
     */
    date: number
    /**
     * A Boolean value indicating whether there is daylight.
     */
    isDaylight: Bool
    /**
     * The level of ultraviolet radiation.
     */
    uvIndex: WeatherUVIndex
    /**
     * The distance at which terrain is visible.
     */
    visibility: UnitLength
    /**
     * Descriptive information about the current weather data.
     */
    metadata: WeatherMetadata
    /**
     * The SF Symbol icon that represents the current weather condition and whether it’s daylight at the current date.
     */
    symbolName: string
    /**
     * 
     * (iOS 18.0+ only) The percentage of the sky covered with low-altitude, middle altitude and high-altitude clouds during the period.
     */
    cloudCoverByAltitude?: CloudCoverByAltitude
    /**
     * The current precipitation intensity in kilometers per hour.
     */
    precipitationIntensity: UnitSpeed
  }

  type WeatherPrecipitation =
    /// No precipitation.
    | "none"

    /// A form of precipitation consisting of solid ice.
    | "hail"

    /// Wintry Mix.
    | "mixed"

    /// Rain.
    | "rain"

    /// A form of precipitation consisting of ice pellets.
    | "sleet"

    /// Snow.
    | "snow"

  type WeatherMoonPhase =
    /// The disk is unlit where the moon is not visible.
    | "new"

    /// The disk is partially lit as the moon is waxing.
    | "waxingCrescent"

    /// The disk is half lit.
    | "firstQuarter"

    /// The disk is half lit as the moon is waxing.
    | "waxingGibbous"

    /// The disk is fully lit where the moon is visible.
    | "full"

    /// The disk is half lit as the moon is waning.
    | "waningGibbous"

    /// The disk is half lit.
    | "lastQuarter"

    /// The disk is partially lit as the moon is waning.
    | "waningCrescent"


  type WeatherMoonEvents = {
    moonrise?: number
    moonset?: number
    phase: WeatherMoonPhase
  }

  type WeatherSunEvents = {
    astronomicalDawn?: number
    astronomicalDusk?: number
    civilDawn?: number
    civilDusk?: number
    nauticalDawn?: number
    nauticalDusk?: number
    solarMidnight?: number
    solarNoon?: number
    sunrise?: number
    sunset?: number
  }

  type SnowfallAmount = {
    amount: UnitLength
    amountLiquidEquivalent: UnitLength
    maximum: UnitLength
    maximumLiquidEquivalent: UnitLength
    minimum: UnitLength
    minimumLiquidEquivalent: UnitLength
  }

  /**
   * An object that provides a breakdown of amounts of all forms of precipitation that is expected to occur over a period of time.
   */
  type PrecipitationAmountByType = {
    hail: UnitLength
    mixed: UnitLength
    precipitation: UnitLength
    rainfall: UnitLength
    sleet: UnitLength
    snowfallAmount: SnowfallAmount
  }

  /**
   * Contains the percentage of sky covered by low, medium and high altitude cloud.
   */
  type CloudCoverByAltitude = {
    high: number
    medium: number
    low: number
  }

  type DayPartForecast = {
    cloudCover: number
    condition: WeatherCondition
    cloudCoverByAltitude: CloudCoverByAltitude
    highWindSpeed: UnitSpeed
    highTemperature: UnitTemperature
    lowTemperature: UnitTemperature
    maximumHumidity: number
    maximumVisibility: UnitLength
    minimumHumidity: number
    minimumVisibility: UnitLength
    precipitation: WeatherPrecipitation
    precipitationAmountByType: PrecipitationAmountByType
    precipitationChance: number
    wind: WeatherWind
  }

  type DayWeather = {
    /**
     * The daytime high temperature.
     */
    highTemperature: UnitTemperature
    /**
     * The overnight low temperature.
     */
    lowTemperature: UnitTemperature
    /**
     * The description of precipitation for this day.
     */
    precipitation: WeatherPrecipitation
    /**
     * The probability of precipitation during the day.
     */
    precipitationChance: number
    /**
     * The lunar events for the day.
     */
    moon: WeatherMoonEvents
    /**
     * The solar events for the day.
     */
    sun: WeatherSunEvents
    /**
     * The wind speed, direction, and gust.
     */
    wind: WeatherWind
    /**
     * A description of the weather condition on this day.
     */
    condition: WeatherCondition
    /**
     * The start time of the day weather.
     */
    date: number
    /**
     * The expected intensity of ultraviolet radiation from the sun.
     */
    uvIndex: WeatherUVIndex
    /**
     * The SF Symbol icon that represents the day weather condition.
     */
    symbolName: string

    /**
     * (iOS 18.0+only) The weather forecast from 7AM - 7PM on this day.
     */
    daytimeForecast?: DayPartForecast
    /**
     * (iOS 18.0+only) The time at which the high temperature occurs on this day.
     */
    highTemperatureTime?: number
    /**
     * (iOS 18.0+only) The maximum sustained wind speed.
     */
    highWindSpeed?: UnitSpeed
    /**
     * (iOS 18.0+only) The maximum amount of water vapor in the air for the day.
     */
    maximumHumidity?: number
    /**
     * (iOS 18.0+only) The maximum distance at which terrain is visible for the day.
     */
    maximumVisibility?: number
    /**
     * (iOS 18.0+only) The minimum amount of water vapor in the air for the day.
     */
    minimumHumidity?: number
    /**
     * (iOS 18.0+only) The minimum distance at which terrain is visible for the day.
     */
    minimumVisibility?: number
    /**
     * (iOS 18.0+only) The time at which the low temperature occurs on this day.
     */
    lowTemperatureTime?: number
    /**
     * (iOS 18.0+only) A breakdown of amounts of all forms of precipitation forecasted for the day.
     */
    precipitationAmountByType?: PrecipitationAmountByType
    /**
     * (iOS 18.0+only) The weather forecast for 7PM on this day until 7AM the following day.
     */
    overnightForecast?: DayPartForecast
    /**
     * (iOS 18.0+only) The forecast from now until midnight local time.
     */
    restOfDayForecast?: DayPartForecast
  }

  type HourWeather = {
    /**
     * The apparent, or “feels like” temperature during the hour.
     */
    apparentTemperature: UnitTemperature
    /**
     * The humidity for the hour.
     */
    humidity: number
    /**
     * The temperature during the hour.
     */
    temperature: UnitTemperature
    /**
     * The amount of moisture in the air.
     */
    dewPoint: UnitTemperature
    /**
     * The atmospheric pressure at sea level at a given location.
     */
    pressure: UnitPressure
    /**
     * The kind and amount of atmospheric pressure change over time.
     */
    pressureTrend: WeatherPressureTrend
    /**
     * The percentage of the sky covered with clouds.
     */
    cloudCover: number
    /**
     * A description of the weather condition for this hour.
     */
    condition: WeatherCondition
    /**
     * The presence or absence of daylight at the requested location and hour.
     */
    isDaylight: boolean
    /**
     * The distance at which an object can be clearly seen.
     */
    visibility: UnitLength
    /**
     * The expected intensity of ultraviolet radiation from the sun.
     */
    uvIndex: WeatherUVIndex
    /**
     * Wind data describing the wind speed, direction, and gust.
     */
    wind: WeatherWind
    /**
     * The start time of the hour weather.
     */
    date: number
    /**
     * Description of precipitation for this hour.
     */
    precipitation: WeatherPrecipitation
    /**
     * The probability of precipitation during the hour.
     */
    precipitationChance: number
    /**
     * The SF Symbol icon that represents the hour weather condition and whether it’s daylight on the hour.
     */
    symbolName: string
    /**
     * The amount of precipitation for the hour.
     */
    precipitationAmount: UnitLength
    /**
     * (iOS 18.0+only) The percentage of the sky covered with low altitude, middle altitude and high altitude clouds during the period.
     */
    cloudCoverByAltitude?: CloudCoverByAltitude
    /**
     * (iOS 18.0+only) The amount of snowfall for the hour.
     */
    snowfallAmount?: UnitLength
  }

  type WeatherDailyForecast = {
    metadata: WeatherMetadata
    forecast: DayWeather[]
  }

  type WeatherHourlyForecast = {
    metadata: WeatherMetadata
    forecast: HourWeather[]
  }

  /**
   * Provides an interface for obtaining weather data.
   */
  declare module Weather {
    /**
     * Query current weather by speficeid location.
     */
    function requestCurrent(location: LocationInfo): Promise<CurrentWeather>
    /**
     * Query the daily forecast by specified location. This returns 10 contiguous days, beginning with the current day.
     * @param location The location to query.
     * @param options The options for the query.
     * @param options.startDate The start date for the forecast.
     * @param options.endDate The end date for the forecast.
     * @returns A promise that resolves to the daily forecast.
     */
    function requestDailyForecast(location: LocationInfo, options?: {
      startDate: Date
      endDate: Date
    }): Promise<WeatherDailyForecast>
    /**
     * Query the hourly forecast by specified location. This returns 25 contiguous hours, beginning with the current hour.
     * @param location The location to query.
     * @param options The options for the query.
     * @param options.startDate The start date for the forecast.
     * @param options.endDate The end date for the forecast.
     * @returns A promise that resolves to the hourly forecast.
     */
    function requestHourlyForecast(location: LocationInfo, options?: {
      startDate: Date
      endDate: Date
    }): Promise<WeatherHourlyForecast>
  }

  type JSONSchemaArray = {
    type: "array"
    items: JSONSchemaType
    required?: boolean
    description: string
  }

  type JSONSchemaObject = {
    type: "object"
    properties: Record<string, JSONSchemaType>
    required?: boolean
    description: string
  }

  type JSONSchemaPrimitive = {
    type: "string" | "number" | "boolean"
    required?: boolean
    description: string
  }

  type JSONSchemaType = JSONSchemaPrimitive | JSONSchemaArray | JSONSchemaObject

  declare module Assistant {
    /**
     * Indicates whether the Assistant API is available.
     * This status depends on the selected AI provider and whether a valid API Key is configured.
     * If the appropriate API Key is not provided, the Assistant API will be unavailable.
     */
    readonly const isAvailable: boolean
    /**
     * Requests structured JSON output from the assistant.
     * @param prompt The input prompt for the assistant.
     * @param schema The expected output JSON schema.
     */
    function requestStructuredData<R>(
      prompt: string,
      schema: JSONSchemaArray | JSONSchemaObject
    ): Promise<R>
  }

  /**
   * Represents a file operation within the script editor.
   */
  type ScriptEditorFileOperation = {
    /**
     * The line number at which the operation should begin.
     */
    startLine: number
    /**
     * The content involved in the operation (e.g. text to insert or replace).
     */
    content: string
  }

  /**
   * Represents a lint error in a script.
   */
  type ScriptLintError = {
    /**
     * The line number where the error occurred.
     */
    line: number
    /**
     * A message describing the linting issue.
     */
    message: string
  }

  /**
   * Interface for interacting with the script editor.
   */
  interface ScriptEditorProvider {
    /**
     * The name of the current script project.
     */
    readonly scriptName: string
    /**
     * Checks if a file exists at the given relative path.
     * @param relativePath - The relative path to the file.
     * @returns True if the file exists, otherwise false.
     */
    exists(relativePath: string): boolean
    /**
     * Returns all folder paths within the current script project.
     */
    getAllFolders(): string[]
    /**
     * Returns all file paths within the current script project.
     */
    getAllFiles(): string[]
    /**
     * Retrieves the content of the specified file.
     * @param relativePath - The relative path to the file.
     * @returns A promise that resolves with the file content, or null if not found.
     */
    getFileContent(relativePath: string): Promise<string | null>
    /**
     * Updates the content of the specified file.
     * @param relativePath - The relative path to the file.
     * @param content - The new content for the file.
     * @returns A promise that resolves with a boolean indicating success.
     */
    updateFileContent(relativePath: string, content: string): Promise<boolean>
    /**
     * Writes content to the specified file. If the file does not exist, it will be created automatically.
     * @param relativePath - The relative path to the file.
     * @param content - The content to write.
     * @returns A promise that resolves with a boolean indicating success.
     */
    writeToFile(relativePath: string, content: string): Promise<boolean>
    /**
     * Inserts content into the specified file based on the provided operations.
     * @param relativePath - The relative path to the file.
     * @param operations - An array of operations describing where and what content to insert.
     * @returns A promise that resolves with a boolean indicating success.
     */
    insertContent(relativePath: string, operations: ScriptEditorFileOperation[]): Promise<boolean>
    /**
     * Replaces content in the specified file based on the provided operations.
     * @param relativePath - The relative path to the file.
     * @param operations - An array of operations describing where and what content to replace.
     * @returns A promise that resolves with a boolean indicating success.
     */
    replaceInFile(relativePath: string, operations: ScriptEditorFileOperation[]): Promise<boolean>
    /**
     * Opens a diff editor for the specified file, comparing its current content with the provided content.
     * @param relativePath - The relative path to the file.
     * @param content - The content to compare against.
     */
    openDiffEditor(relativePath: string, content: string): void
    /**
     * Retrieves the current lint errors from the script editor.
     * @returns An object mapping file paths to arrays of lint errors.
     */
    getLintErrors(): Record<string, ScriptLintError[]>
  }

  /**
   * Function that generates an approval request prompt for the user.
   */
  type AssistantToolApprovalRequestFn<P> = (
    /**
     * The tool's input parameters.
     */
    params: P,
    /**
     * When the tool is exclusively available for the script editor, a ScriptEditorProvider instance is provided
     * to allow communication with the editor.
     */
    scriptEditorProvider?: ScriptEditorProvider
  ) => Promise<{
    /**
     * Optional title for the approval dialog (defaults to the tool's `displayName` if not provided).
     */
    title?: string
    /**
     * The message displayed to the user when requesting approval.
     */
    message: string
    /**
     * Optional preview button that allows the user to view the tool's expected output prior to approval.
     */
    previewButton?: {
      /**
       * The label for the preview button.
       */
      label: string
      /**
       * The function executed when the preview button is clicked.
       */
      action: () => void
    }
    /**
     * The label for the primary approval button. If omitted, this button will not be displayed.
     */
    primaryButtonLabel?: string
    /**
     * The label for the secondary approval button. If omitted, this button will not be displayed.
     */
    secondaryButtonLabel?: string
  }>

  /**
   * Test function for generating an approval request prompt.
   */
  type AssistantToolApprovalRequestTestFn<P> = (params: P) => void

  /**
   * Represents the user's action in response to an approval request.
   */
  type UserActionForApprovalRequest = {
    /**
     * Indicates whether the primary button was clicked.
     * If no primary button is provided, this value should always be false.
     */
    primaryConfirmed: boolean
    /**
     * Indicates whether the secondary button was clicked.
     * If no secondary button is provided, this value should always be false.
     */
    secondaryConfirmed: boolean
  }

  /**
   * Function to execute the tool after receiving user approval.
   */
  type AssistantToolExecuteWithApprovalFn<P> = (
    /**
     * The tool's input parameters.
     */
    params: P,
    /**
     * The user's action (i.e., which approval button was clicked).
     */
    userAction: UserActionForApprovalRequest,
    /**
     * When the tool is exclusively available for the script editor, a ScriptEditorProvider instance is provided
     * to allow communication with the editor.
     */
    scriptEditorProvider?: ScriptEditorProvider
  ) => Promise<{
    /**
     * Indicates whether the tool execution was successful.
     */
    success: boolean
    /**
     * The response message to be returned to the assistant.
     */
    message: string
  }>

  /**
   * Test function for executing the tool with approval.
   */
  type AssistantToolExecuteWithApprovalTestFn<P> = (
    /**
     * The tool's input parameters.
     */
    params: P,
    /**
     * The user's action (i.e., which approval button was clicked).
     */
    userAction: UserActionForApprovalRequest
  ) => void

  /**
   * Function to execute the tool.
   */
  type AssistantToolExecuteFn<P> = (
    /**
     * The tool's input parameters.
     */
    params: P,
    /**
     * When the tool is exclusively available for the script editor, a ScriptEditorProvider instance is provided
     * to allow communication with the editor.
     */
    scriptEditorProvider?: ScriptEditorProvider
  ) => Promise<{
    /**
     * Indicates whether the tool execution was successful.
     */
    success: boolean
    /**
     * The response message to be returned to the assistant.
     */
    message: string
  }>

  /**
   * Test function for executing the tool.
   */
  type AssistantToolExecuteTestFn<P> = (params: P) => void

  declare module AssistantTool {
    /**
     * Registers the function that generates an approval request prompt for the user.
     * @param requestFn - The function that creates the approval request.
     * @returns A test function for the approval request.
     */
    function registerApprovalRequest<P>(
      requestFn: AssistantToolApprovalRequestFn<P>
    ): AssistantToolApprovalRequestTestFn<P>
    /**
     * Registers the function that executes the tool after user approval.
     * @param executeFn - The function that executes the tool with approval.
     * @returns A test function for the execution with approval.
     */
    function registerExecuteToolWithApproval<P>(
      executeFn: AssistantToolExecuteWithApprovalFn<P>
    ): AssistantToolExecuteWithApprovalTestFn<P>
    /**
     * Registers the function that executes the tool.
     * @param executeFn - The function that executes the tool.
     * @returns A test function for the execution.
     */
    function registerExecuteTool<P>(
      executeFn: AssistantToolExecuteFn<P>
    ): AssistantToolExecuteTestFn<P>
    /**
     * Reports a message when the tool is executing.
     * @param message - The message to report.
     */
    function report(message: string): void
  }

  /**
   * This interface allows you present a mail compose view.
   */
  declare module Mail {
    readonly const isAvailable: boolean

    /**
     * Presents a mail compose view with the specified options.
     */
    function present(options: {
      /**
       * An array specifying the email addresses of recipients.
       */
      toRecipients: string[]
      /**
       * An array specifying the email addresses of recipients to include in the CC (carbon copy) list.
       */
      ccRecipients?: string[]
      /**
       * An array specifying the email addresses of recipients to include in the BCC (blind carbon copy) list.
       */
      bccRecipients?: string[]
      /**
       * A string specifying the preferred email address used to send this message.
       */
      preferredSendingEmailAddress?: string
      /**
       * A string containing the subject of the email message.
       */
      subject?: string
      /**
       * A string containing the body contents of the email message.
       */
      body?: string
      /**
       *  Adds the specified attachments to the email message
       */
      attachments?: {
        /**
         * The data to attach to the email.
         */
        data: Data
        /**
         * The MIME type of the attachment.
         * See [MIME types](http://www.iana.org/assignments/media-types/media-types.xhtml) for more information.
         */
        mimeType: string
        /**
         * The filename of the attachment.
         */
        fileName: string
      }[]
    }): Promise<void>
  }

  /**
   * Represents the birthday details of a contact.
   */
  interface ContactBirthday {
    /** The year of the birthday. */
    year?: number
    /** The month of the birthday. */
    month?: number
    /** The day of the birthday. */
    day?: number
  }

  /**
   * Represents a labeled value for contact properties such as phone, email, or URL.
   */
  interface ContactLabeledValue {
    /** The label for the value (e.g., "home", "work"). */
    label: string
    /** The value associated with the label (e.g., a phone number or email address). */
    value: string
  }

  /**
   * Represents a labeled date for contact properties such as anniversaries or other dates.
   */
  interface ContactLabeledDate {
    /**
     * The label for the date (e.g., "anniversary", "birthday").
     */
    label: string
    /**
     * The date value.
     */
    value: {
      year: number
      month: number
      day: number
    }
  }

  /**
   * Represents the postal address details of a contact.
   */
  interface ContactPostalAddress {
    /** The label for the postal address. */
    label: string
    /** The street information of the address. */
    street: string
    /** The city of the address. */
    city: string
    /** The state or province of the address. */
    state: string
    /** The postal code of the address. */
    postalCode: string
    /** The country of the address. */
    country: string
    /** The ISO country code of the address. */
    isoCountryCode: string
  }

  /**
   * Represents the social profile information of a contact.
   */
  interface ContactSocialProfile {
    /** The label for the social profile (e.g., "Facebook", "Twitter"). */
    label: string
    /** The service type for the social profile. */
    service: string
    /** The username for the social profile. */
    username: string
    /** The unique identifier of the social profile. */
    userIdentifier: string
    /** The URL associated with the social profile. */
    urlString: string
  }

  /**
   * Represents the instant messaging information of a contact.
   */
  interface ContactInstantMessageAddress {
    /** The label for the instant messaging address. */
    label: string
    /** The username used in instant messaging. */
    username: string
    /** The service type for instant messaging (e.g., "Skype"). */
    service: string
  }

  /**
   * Represents all available information for a contact.
   */
  interface ContactInfo {
    /** The unique identifier of the contact. */
    identifier: string
    /** The given (first) name of the contact. */
    givenName: string
    /** The family (last) name of the contact. */
    familyName: string
    /** The middle name of the contact (optional). */
    middleName?: string
    /** The name prefix (e.g., "Mr.", "Ms.") of the contact (optional). */
    namePrefix?: string
    /** The name suffix (e.g., "Jr.", "Sr.") of the contact (optional). */
    nameSuffix?: string
    /** The nickname of the contact (optional). */
    nickname?: string
    /** The image data of the contact. It is recommended that you fetch this property only when you need to access its value, such as when you need to display the contact’s profile picture. */
    imageData?: Data
    /** The phonetic given name of the contact (optional). */
    phoneticGivenName?: string
    /** The phonetic middle name of the contact (optional). */
    phoneticMiddleName?: string
    /** The phonetic family name of the contact (optional). */
    phoneticFamilyName?: string
    /** The organization name associated with the contact (optional). */
    organizationName?: string
    /** The department name within the organization (optional). */
    departmentName?: string
    /** The job title of the contact (optional). */
    jobTitle?: string
    /** The birthday details of the contact (optional). */
    birthday?: ContactBirthday
    /** An array of labeled dates associated with the contact (e.g., anniversaries, other dates). */
    dates: ContactLabeledDate[]
    // /** Additional notes about the contact (optional). */
    // note?: string
    /** An array of labeled phone numbers. */
    phoneNumbers: ContactLabeledValue[]
    /** An array of labeled email addresses. */
    emailAddresses: ContactLabeledValue[]
    /** An array of postal addresses. */
    postalAddresses: ContactPostalAddress[]
    /** An array of labeled URL addresses. */
    urlAddresses: ContactLabeledValue[]
    /** An array of social profile details. */
    socialProfiles: ContactSocialProfile[]
    /** An array of instant messaging addresses. */
    instantMessageAddresses: ContactInstantMessageAddress[]
  }

  /**
   * Represents the type of contact container.
   */
  enum ContactContainerType {
    unassigned,
    local,
    exchange,
    cardDAV,
  }

  /**
   * Represents a contact container.
   */
  interface ContactContainer {
    identifier: string
    name: string
    type: ContactContainerType
  }

  /**
   * Represents a contact group.
   */
  interface ContactGroup {
    identifier: string
    name: string
  }

  /**
   * Provides an interface for interacting with the contacts database.
   */
  declare module Contact {
    /**
     * Creates a new contact.
     * @param info - An object containing the contact details. Must include at least a givenName or familyName.
     * @param containerIdentifier - (Optional) The identifier of the container to which the contact should be added.
     * @returns A promise will resolve the created contact as a ContactInfo object, or throw an error if creation fails.
     */
    function createContact(
      info: {
        /** The given (first) name of the contact. */
        givenName: string
        /** The family (last) name of the contact. */
        familyName: string
        /** The middle name of the contact (optional). */
        middleName?: string
        /** The name prefix (e.g., "Mr.", "Ms.") of the contact (optional). */
        namePrefix?: string
        /** The name suffix (e.g., "Jr.", "Sr.") of the contact (optional). */
        nameSuffix?: string
        /** The nickname of the contact (optional). */
        nickname?: string
        /** The image data of the contact. */
        imageData?: Data
        /** The phonetic given name of the contact (optional). */
        phoneticGivenName?: string
        /** The phonetic middle name of the contact (optional). */
        phoneticMiddleName?: string
        /** The phonetic family name of the contact (optional). */
        phoneticFamilyName?: string
        /** The organization name associated with the contact (optional). */
        organizationName?: string
        /** The department name within the organization (optional). */
        departmentName?: string
        /** The job title of the contact (optional). */
        jobTitle?: string
        /** The birthday details of the contact (optional). */
        birthday?: ContactBirthday
        /** An array of labeled dates associated with the contact (e.g., anniversaries, other dates). */
        dates?: ContactLabeledDate[]
        // /** Additional notes about the contact (optional). */
        // note?: string
        /** An array of labeled phone numbers (optional). */
        phoneNumbers?: ContactLabeledValue[]
        /** An array of labeled email addresses (optional). */
        emailAddresses?: ContactLabeledValue[]
        /** An array of postal addresses (optional). */
        postalAddresses?: ContactPostalAddress[]
        /** An array of labeled URL addresses (optional). */
        urlAddresses?: ContactLabeledValue[]
        /** An array of social profile details (optional). */
        socialProfiles?: ContactSocialProfile[]
        /** An array of instant messaging addresses (optional). */
        instantMessageAddresses?: ContactInstantMessageAddress[]
      },
      containerIdentifier?: string
    ): Promise<ContactInfo>

    /**
     * Updates an existing contact.
     * @param info - An object containing updated contact details. Must include the contact's unique identifier.
     * @returns Return a promise will resolve the updated ContactInfo object if the update is successful, otherwise throw an error.
     */
    function updateContact(info: {
      /** The unique identifier of the contact. */
      identifier: string
      givenName?: string
      familyName?: string
      middleName?: string
      namePrefix?: string
      nameSuffix?: string
      nickname?: string
      imageData?: Data
      phoneticGivenName?: string
      phoneticMiddleName?: string
      phoneticFamilyName?: string
      organizationName?: string
      departmentName?: string
      jobTitle?: string
      birthday?: ContactBirthday
      dates?: ContactLabeledDate[]
      phoneNumbers?: ContactLabeledValue[]
      emailAddresses?: ContactLabeledValue[]
      postalAddresses?: ContactPostalAddress[]
      urlAddresses?: ContactLabeledValue[]
      socialProfiles?: ContactSocialProfile[]
      instantMessageAddresses?: ContactInstantMessageAddress[]
    }): Promise<ContactInfo>

    /**
     * Fetches a contact by its identifier.
     * @param identifier - The unique identifier of the contact.
     * @param options - (Optional) An object containing fetch options.
     * @returns A promiss will resolve a ContactInfo object representing the contact, or throw an error.
     */
    function fetchContact(identifier: string, options?: {
      /**
       * It is recommended that you fetch this property only when you need to access its value, such as when you need to display the contact’s profile picture.
       */
      fetchImageData?: boolean
    }): Promise<ContactInfo>

    /**
     * Fetches all contacts.
     * @param options - (Optional) An object containing fetch options.
     * @returns An array of ContactInfo objects.
     */
    function fetchAllContacts(options?: {
      /**
       * It is recommended that you fetch this property only when you need to access its value, such as when you need to display the contact’s profile picture.
       */
      fetchImageData?: boolean
    }): Promise<ContactInfo[]>

    /**
     * Fetches all contacts in a specified container.
     * @param containerIdentifier - The unique identifier of the container.
     * @param options - (Optional) An object containing fetch options.
     * @returns An array of ContactInfo objects.
     */
    function fetchContactsInContainer(containerIdentifier: string, options?: {
      /**
       * It is recommended that you fetch this property only when you need to access its value, such as when you need to display the contact’s profile picture.
       */
      fetchImageData?: boolean
    }): Promise<ContactInfo[]>

    /**
     * Fetches all contacts in a specified group.
     * @param groupIdentifier - The unique identifier of the group.
     * @param options - (Optional) An object containing fetch options.
     * @returns An array of ContactInfo objects.
     */
    function fetchContactsInGroup(groupIdentifier: string, options?: {
      /**
       * It is recommended that you fetch this property only when you need to access its value, such as when you need to display the contact’s profile picture.
       */
      fetchImageData?: boolean
    }): Promise<ContactInfo[]>

    /**
     * Deletes a contact by its identifier.
     * @param identifier - The unique identifier of the contact.
     * @returns A promise resolve nothing if deletion is successful, or throw an error.
     */
    function deleteContact(identifier: string): Promise<void>

    /**
     * Fetches all contact containers.
     * @returns A promise will resolve an array of container objects containing properties such as identifier, name, and type.
     */
    function fetchContainers(): Promise<ContactContainer[]>

    /**
     * Fetches groups.
     * @param containerIdentifiers - (Optional) An array of container identifiers to limit the search.
     * @returns A promise will resolve an array of group objects containing properties like identifier, name.
     */
    function fetchGroups(containerIdentifiers?: string[]): Promise<ContactGroup[]>

    /**
     * Creates a new group.
     * @param info - An object containing the group details. Must include both name and containerIdentifier.
     * @param containerIdentifier - (Optional) The identifier of the container to which the group should be added.
     * @returns A promise will resolve the created group as a ContactGroup object, or throw an error if creation fails.
     */
    function createGroup(groupName: string, containerIdentifier?: string): Promise<ContactGroup>

    /**
     * Deletes a group by its identifier.
     * @param identifier - The unique identifier of the group.
     * @returns A promise will resolve nothing if deletion is successful, or throw an error.
     */
    function deleteGroup(identifier: string): Promise<void>

    /**
     * Adds a contact to a specified group.
     * @param contactIdentifier - The unique identifier of the contact.
     * @param toGroup - The unique identifier of the group.
     * @returns A promise will resolve nothing if the contact is added successfully, or throw an error.
     */
    function addContactToGroup(contactIdentifier: string, toGroup: string): Promise<void>

    /**
     * Removes a contact from a specified group.
     * @param contactIdentifier - The unique identifier of the contact.
     * @param fromGroup - The unique identifier of the group.
     * @returns A promise will resolve nothing if the contact is removed successfully, or throw an error.
     */
    function removeContactFromGroup(contactIdentifier: string, fromGroup: string): Promise<void>

    /**
     * The default container identifier, typically the identifier of the first container in the contacts database.
     */
    readonly const defaultContainerIdentifier: Promise<string>
  }

  /**
   * A block of recognized text.
   */
  type RecognizedText = {
    /**
     * The recognized text.
     */
    content: string
    /**
     * The confidence level is a normalized value between 0.0 and 1.0, where 1.0 represents the highest confidence.
     */
    confidence: number
    /**
     * The bounding box of the recognized text.
     */
    boundingBox: {
      x: number
      y: number
      width: number
      height: number
    }
  }

  /**
   * Options for text recognition.
   */
  type RecognizeTextOptions = {
    /**
     * A value that determines whether the request prioritizes accuracy or speed in text recognition.
     * The default value is "accurate".
     * - "accurate": Prioritizes accuracy over speed.
     * - "fast": Prioritizes speed over accuracy.
     */
    recognitionLevel?: "accurate" | "fast"
    /**
     * An array of languages to detect, in priority order.
     * 
     * The order of the languages in the array defines the order in which languages are used during language processing and text recognition.
     * 
     * Specify the languages as ISO language codes.
     */
    recognitionLanguages?: string[]
    /**
     * A Boolean value that indicates whether the request applies language correction during the recognition process.
     */
    usesLanguageCorrection?: boolean
    /**
     * The minimum height, relative to the image height, of the text to recognize.
     * 
     * Specify a floating-point number relative to the image height. For example, to limit recognition to text that’s half of the image height, use 0.5. Increasing the size reduces memory consumption and expedites recognition with the tradeoff of ignoring text smaller than the minimum height. The default value is 1/32, or 0.03125.
     */
    minimumTextHeight?: number
    /**
     * An array of strings to supplement the recognized languages at the word-recognition stage.
     * 
     * Custom words take precedence over the standard lexicon. The request ignores this value if `usesLanguageCorrection` is false.
     */
    customWords?: string[]
  }

  /**
   * This module provides an interface for text recognition tasks.
   * It allows you to detect and recognize text in images or camera input.
   */
  declare module Vision {

    /**
     * Recognizes text in the provided image.
     * @param image The image to be processed for text recognition.
     * @param options An optional object containing various options for text recognition.
     * @returns A promise that resolves with the recognized text and its bounding box.
     */
    function recognizeText(
      image: UIImage,
      options?: RecognizeTextOptions
    ): Promise<{
      /**
       * The recognized text.
       */
      text: string
      /**
       * This is an array of recognized text blocks, each containing the recognized text, confidence level, and bounding box.
       */
      candidates: RecognizedText[]
    }>

    /**
     * Recognizes text in the camera input.
     * @param options An optional object containing various options for text recognition.
     * @returns A promise that resolves with an array of recognized texts. If the user cancels the operation, the promise rejects with an error.
     */
    function scanDocument(options?: RecognizeTextOptions): Promise<string[]>
  }

  /**
   * This class provides an interface for working with PDF page.
   */
  class PDFPage {
    /**
     * Creates a PDF page from the given image.
     * @param image The image to be converted to a PDF page.
     */
    static fromImage(image: UIImage): PDFPage | null

    /**
     * The PDF document that contains this page.
     */
    readonly document: PDFDocument | null
    /**
     * The label of the page.
     */
    readonly label: string | null
    /**
     * The number of characters in the page.
     */
    readonly numberOfCharacters: number
    /**
     * The string representation of the page.
     * This is the text content of the page.
     * It may be null if the page is not text-based, for example, if it is an image.
     */
    get string(): Promise<string | null>
    /**
     * The data representation of the page.
     */
    get data(): Promise<Data | null>
  }

  /**
   * This class provides an interface for working with PDF documents.
   * It allows you to read, modify, and save PDF documents.
   */
  class PDFDocument {
    /**
     * Creates a PDF document from the given data.
     * @param data The data to be converted to a PDF document.
     * @return A PDFDocument instance, or `null` if the data is not a valid PDF document.
     */
    static fromData(data: Data): PDFDocument | null
    /**
     * Creates a PDF document from the given file path.
     * @param filePath The file path to the PDF document.
     * @return A PDFDocument instance, or `null` if the file path is not valid or the document cannot be opened.
     */
    static fromFilePath(filePath: string): PDFDocument | null

    /**
     * The page count of the PDF document.
     */
    readonly pageCount: number
    /**
     * The data representation of the PDF document.
     */
    get data(): Promise<Data | null>
    /**
     * The file path of the PDF document.
     */
    readonly filePath: string | null
    /**
     * The string representation of the PDF document.
     */
    get string(): Promise<string | null>
    /**
     * The lock status of the PDF document.
     */
    readonly isLocked: boolean
    /**
     * The encryption status of the PDF document.
     * This indicates whether the document is encrypted or not.
     */
    readonly isEncrypted: boolean

    /**
     * The attributes of the PDF document.
     * This includes metadata such as author, creation date, and title.
     * The attributes are optional and may be null if not set.
     * You can use this to retrieve or set the document's metadata.
     * @example
     * ```ts
     * const pdfDocument = PDFDocument.fromFilePath("path/to/document.pdf")
     * const attributes = pdfDocument.documentAttributes
     * console.log(attributes.author) // Output: "John Doe"
     * console.log(attributes.creationDate.toLocalString()) // Output: "2023-10-01T12:00:00Z"
     * console.log(attributes.title) // Output: "My PDF Document"
     * ```
     */
    documentAttributes?: {
      author?: string | null
      creationDate?: Date | null
      creator?: string | null
      keywords?: any | null
      modificationDate?: Date | null
      producer?: string | null
      subject?: string | null
      title?: string | null
    } | null

    /**
     * Retrieves the page at the specified index.
     * @param index The index of the page to retrieve.
     * @return The PDFPage instance at the specified index, or null if the index is out of bounds.
     * @example
     * ```ts
     * const pdfDocument = PDFDocument.fromFilePath("path/to/document.pdf")
     * const page = pdfDocument.pageAt(0)
     * if (page) {
     *   console.log(page.string) // Output: "This is the content of the first page."
     * } else {
     *   console.log("Page not found.")
     * }
     * ```
     */
    pageAt(index: number): PDFPage | null
    /**
     * Get the index of the specified page in the document.
     * @param page The PDFPage instance to be searched for in the document.
     * @return The index of the page in the document, or -1 if the page is not found.
     * @example
     * ```ts
     * const pdfDocument = PDFDocument.fromFilePath("path/to/document.pdf")
     * const page = pdfDocument.pageAt(0)
     * const index = pdfDocument.indexOf(page)
     * console.log(`Page index: ${index}`) // Output: "Page index: 0"
     * ```
     */
    indexOf(page: PDFPage): number
    /**
     * Removes the page at the specified index from the document.
     * @param index The index of the page to remove.
     * @example
     * ```ts
     * const pdfDocument = PDFDocument.fromFilePath("path/to/document.pdf")
     * pdfDocument.removePageAt(0) // Removes the first page
     * ```
     */
    removePageAt(index: number): void
    /**
     * Inserts a new page at the specified index in the document.
     * @param page The PDFPage instance to be inserted.
     * @param atIndex The index at which to insert the page.
     * @example
     * ```ts
     * const pdfDocument = PDFDocument.fromFilePath("path/to/document.pdf")
     * const newPage = PDFPage.fromImage(image)
     * pdfDocument.insertPageAt(newPage, 1) // Inserts the new page at index 1
     * ```
     */
    insertPageAt(page: PDFPage, atIndex: number): void
    /**
     * Exchanges the pages at the specified indices in the document.
     * @param atIndex The index of the first page to exchange.
     * @param withPageIndex The index of the second page to exchange.
     * @example
     * ```ts
     * const pdfDocument = PDFDocument.fromFilePath("path/to/document.pdf")
     * pdfDocument.exchangePage(0, 1) // Exchanges the first and second pages
     * ```
     */
    exchangePage(atIndex: number, withPageIndex: number): void
    /**
     * Writes the PDF document to the specified file path.
     * @param toFilePath - The file path where the PDF document will be saved.
     * @param options - (Optional) An object containing encryption options.
     * @param options.ownerPassword - The password for the owner of the document.
     * @param options.userPassword - The password for the user of the document.
     * @param options.burnInAnnotations - A boolean indicating whether to burn in annotations.
     * @param options.saveTextFromOCR - A boolean indicating whether to save text from OCR.
     * @param options.saveImagesAsJPEG - A boolean indicating whether to save images as JPEG.
     * @returns A boolean indicating whether the write operation was successful.
     * @example
     * ```ts
     * const pdfDocument = PDFDocument.fromFilePath("path/to/document.pdf")
     * 
     * // Save the PDF document with encryption.
     * const success = pdfDocument.writeSync("path/to/newDocument.pdf", {
     *   ownerPassword: "ownerPassword",
     *   userPassword: "userPassword"
     * })
     * if (success) {
     *   console.log("PDF document saved successfully.")
     * } else {
     *   console.log("Failed to save PDF document.")
     * }
     * ```
     */
    writeSync(toFilePath: string, options?: {
      ownerPassword?: string
      userPassword?: string
      burnInAnnotations?: boolean
      saveTextFromOCR?: boolean
      saveImagesAsJPEG?: boolean
    }): boolean
    /**
     * Writes the PDF document to the specified file path asynchronously.
     */
    write(toFilePath: string, options?: {
      ownerPassword?: string
      userPassword?: string
      burnInAnnotations?: boolean
      saveTextFromOCR?: boolean
      saveImagesAsJPEG?: boolean
    }): Promise<boolean>
    /**
     * Encrypts the PDF document with the specified password.
     * @see {@link https://developer.apple.com/documentation/pdfkit/pdfdocument/unlock(withpassword:)}
     * @param password The password to unlock the document.
     * @returns A boolean indicating whether the encryption was successful.
     */
    unlock(password: string): boolean
  }
}

export { }