import UIKit
import WebKit

class ViewController: UIViewController, WKNavigationDelegate, WKUIDelegate {

    var webView: WKWebView!
    var progressView: UIProgressView!

    override func loadView() {
        let webConfiguration = WKWebViewConfiguration()

        // Enable JavaScript
        webConfiguration.preferences.javaScriptEnabled = true

        // Allow inline media playback
        webConfiguration.allowsInlineMediaPlayback = true

        // Create content controller for JavaScript injection
        let contentController = WKUserContentController()

        // Add a script to handle AO3 metadata extraction
        let script = """
            // Helper function to extract AO3 metadata
            function extractAO3Metadata() {
                const metadata = {};

                // Try to extract title
                const titleElement = document.querySelector('h2.title');
                if (titleElement) {
                    metadata.title = titleElement.textContent.trim();
                }

                // Try to extract author
                const authorElement = document.querySelector('a[rel="author"]');
                if (authorElement) {
                    metadata.author = authorElement.textContent.trim();
                }

                // Try to extract summary
                const summaryElement = document.querySelector('.summary .userstuff');
                if (summaryElement) {
                    metadata.summary = summaryElement.textContent.trim();
                }

                // Try to extract tags
                const tags = [];
                document.querySelectorAll('.tag').forEach(tag => {
                    tags.push(tag.textContent.trim());
                });
                metadata.tags = tags;

                // Try to extract relationships
                const relationships = [];
                document.querySelectorAll('.relationship').forEach(rel => {
                    relationships.push(rel.textContent.trim());
                });
                metadata.relationships = relationships;

                // Try to extract word count
                const statsElement = document.querySelector('dd.words');
                if (statsElement) {
                    metadata.wordCount = statsElement.textContent.trim();
                }

                // Try to extract chapters
                const chaptersElement = document.querySelector('dd.chapters');
                if (chaptersElement) {
                    metadata.chapters = chaptersElement.textContent.trim();
                }

                return metadata;
            }

            // Notify the app when the page loads
            window.addEventListener('load', function() {
                if (window.location.hostname.includes('archiveofourown.org')) {
                    const metadata = extractAO3Metadata();
                    window.webkit.messageHandlers.ao3Metadata.postMessage(metadata);
                }
            });
        """

        let userScript = WKUserScript(source: script, injectionTime: .atDocumentEnd, forMainFrameOnly: true)
        contentController.addUserScript(userScript)

        // Add message handler for AO3 metadata
        contentController.add(self, name: "ao3Metadata")

        webConfiguration.userContentController = contentController

        webView = WKWebView(frame: .zero, configuration: webConfiguration)
        webView.navigationDelegate = self
        webView.uiDelegate = self

        // Enable pulling down to refresh
        let refreshControl = UIRefreshControl()
        refreshControl.addTarget(self, action: #selector(refreshWebView), for: .valueChanged)
        webView.scrollView.addSubview(refreshControl)
        webView.scrollView.bounces = true

        view = webView
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        // Set navigation title
        title = "AO Vault"

        // Add progress bar
        progressView = UIProgressView(progressViewStyle: .default)
        progressView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(progressView)

        NSLayoutConstraint.activate([
            progressView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            progressView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            progressView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            progressView.heightAnchor.constraint(equalToConstant: 2)
        ])

        // Add observer for progress
        webView.addObserver(self, forKeyPath: #keyPath(WKWebView.estimatedProgress), options: .new, context: nil)

        // Add navigation buttons
        setupNavigationBar()

        // Load the local development server
        loadWebApp()
    }

    func setupNavigationBar() {
        // Add refresh button
        let refreshButton = UIBarButtonItem(barButtonSystemItem: .refresh, target: self, action: #selector(refreshWebView))

        // Add share button for saving fanfiction URLs
        let shareButton = UIBarButtonItem(barButtonSystemItem: .action, target: self, action: #selector(shareContent))

        navigationItem.rightBarButtonItems = [refreshButton, shareButton]

        // Add back/forward buttons
        let backButton = UIBarButtonItem(title: "←", style: .plain, target: webView, action: #selector(WKWebView.goBack))
        let forwardButton = UIBarButtonItem(title: "→", style: .plain, target: webView, action: #selector(WKWebView.goForward))

        navigationItem.leftBarButtonItems = [backButton, forwardButton]
    }

    func loadWebApp() {
        // Try to load from localhost first (development)
        let devURL = URL(string: "http://localhost:5173")!
        let request = URLRequest(url: devURL)
        webView.load(request)

        // Show loading indicator
        progressView.progress = 0.0
        progressView.isHidden = false
    }

    @objc func refreshWebView() {
        webView.reload()
        if let refreshControl = webView.scrollView.subviews.first(where: { $0 is UIRefreshControl }) as? UIRefreshControl {
            refreshControl.endRefreshing()
        }
    }

    @objc func shareContent() {
        guard let url = webView.url else { return }

        let activityViewController = UIActivityViewController(activityItems: [url], applicationActivities: nil)
        present(activityViewController, animated: true, completion: nil)
    }

    // MARK: - KVO
    override func observeValue(forKeyPath keyPath: String?, of object: Any?, change: [NSKeyValueChangeKey : Any]?, context: UnsafeMutableRawPointer?) {
        if keyPath == "estimatedProgress" {
            progressView.progress = Float(webView.estimatedProgress)
            progressView.isHidden = webView.estimatedProgress >= 1.0
        }
    }

    // MARK: - WKNavigationDelegate
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        progressView.isHidden = true
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        progressView.isHidden = true

        // If localhost fails, show an error message
        if (error as NSError).code == NSURLErrorCannotConnectToHost {
            showLocalServerError()
        }
    }

    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        // Allow navigation to AO3 and other fanfiction sites
        if let url = navigationAction.request.url {
            if url.host?.contains("archiveofourown.org") == true ||
               url.host?.contains("fanfiction.net") == true ||
               url.host?.contains("wattpad.com") == true {
                // Open external fanfiction sites in the web view
                decisionHandler(.allow)
            } else {
                decisionHandler(.allow)
            }
        } else {
            decisionHandler(.allow)
        }
    }

    func showLocalServerError() {
        let alert = UIAlertController(
            title: "Server Not Running",
            message: "The AO Vault server is not running. Please start it with:\n\ncd ~/Desktop/ao-vault && npm run dev",
            preferredStyle: .alert
        )

        alert.addAction(UIAlertAction(title: "Try Again", style: .default) { _ in
            self.loadWebApp()
        })

        alert.addAction(UIAlertAction(title: "OK", style: .cancel, handler: nil))

        present(alert, animated: true, completion: nil)
    }

    deinit {
        webView.removeObserver(self, forKeyPath: #keyPath(WKWebView.estimatedProgress))
    }
}

// MARK: - WKScriptMessageHandler
extension ViewController: WKScriptMessageHandler {
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if message.name == "ao3Metadata" {
            // Handle AO3 metadata extraction
            if let metadata = message.body as? [String: Any] {
                print("Extracted AO3 Metadata:")
                print("Title: \(metadata["title"] ?? "N/A")")
                print("Author: \(metadata["author"] ?? "N/A")")
                print("Summary: \(metadata["summary"] ?? "N/A")")
                print("Tags: \(metadata["tags"] ?? [])")
                print("Relationships: \(metadata["relationships"] ?? [])")
                print("Word Count: \(metadata["wordCount"] ?? "N/A")")
                print("Chapters: \(metadata["chapters"] ?? "N/A")")

                // You can send this data back to your web app or handle it natively
                let jsCode = """
                    window.postMessage({
                        type: 'AO3_METADATA',
                        data: \(try! JSONSerialization.data(withJSONObject: metadata, options: []))
                    }, '*');
                """

                webView.evaluateJavaScript(jsCode) { result, error in
                    if let error = error {
                        print("Error sending metadata to web app: \(error)")
                    }
                }
            }
        }
    }
}