import { version } from "dompurify";

window.Disco = window.Disco || window.parent.Disco
document.querySelector("#resetbtn").addEventListener("flowClick", () => {

    window.parent.DiscoBoard.alert(
        window.i18n.t("settings.alerts.reset.title"),
        window.i18n.t("settings.alerts.reset.message"),
        [{
            title: window.i18n.t("common.actions.yes"), style: "default", inline: true, action: async () => {
                await window.parent.DiscoBoard.backendMethods.reset()
                appViewEvents.reloadApp()
            }
        }, { title: window.i18n.t("common.actions.no"), style: "default", inline: true, action: () => { } }]
    );
})
function alreadyUpToDate() {
    window.parent.DiscoBoard.alert(
        window.i18n.t("settings.alerts.up_to_date.title"),
        window.i18n.t("settings.alerts.up_to_date.message"),
        [{ title: window.i18n.t("common.actions.ok"), style: "default", inline: true, action: () => { } }]
    );
}
function formatFileSize(size) {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let index = 0;

    while (size >= 1024 && index < units.length - 1) {
        size /= 1024;
        index++;
    }

    return `${size.toFixed(1)} ${units[index]}`;
}
document.querySelector("#updatebutton").addEventListener("flowClick", (e) => {
    e.target.classList.add("loading")
    const isBeta = Disco.getAppVersion().includes("beta") || Disco.getAppVersion() == 'web-test'

    const getReleasesApi = () => {
        const repoUrl = (window.BuildConfig && typeof window.BuildConfig.REPOSITORY_URL === "function" && window.BuildConfig.REPOSITORY_URL()) || "";
        if (!repoUrl) return null;
        try {
            const url = new URL(repoUrl.replace(/\\:/g, ':').replace(/\\\//g, '/'));
            const parts = url.pathname.split('/').filter(Boolean);
            if (parts.length >= 2) {
                const owner = parts[0];
                const repo = parts[1];
                return `https://api.github.com/repos/${owner}/${repo}/releases?per_page=10`;
            }
        } catch (_e) { }
        return null;
    }
    const releasesApi = getReleasesApi();
    if (!releasesApi) {
        document.querySelector("#updatebutton").classList.remove("loading")
        window.parent.DiscoBoard.alert(
            window.i18n.t("settings.alerts.update_check_failed.title"),
            window.i18n.t("settings.alerts.update_check_failed.message"),
            [{ title: window.i18n.t("common.actions.ok"), style: "default", inline: true, action: () => { } }]
        );
        return;
    }

    fetch(releasesApi)
        .then(response => response.json())
        .then(releases => {
            const availableReleases = releases.filter(release => (release.name.includes("beta") == isBeta))
            if (availableReleases.length) {
                const update = availableReleases[0]
                if (update.name == Disco.getAppVersion()) {
                    alreadyUpToDate()
                } else {
                    const updateUrl = update.assets.length == 1 ? update.assets[0].browser_download_url : update.html_url
                    parent.DiscoBoard.alert(
                        window.i18n.t("settings.alerts.update_available.title"),
                        update.assets.length == 1 ?
                            //`A new version <strong>(${update.name})</strong> is available, sized at ${formatFileSize(update.assets[0].size)}. Would you like to download it?`
                            window.i18n.t("settings.alerts.update_available.message", { version: update.name, size: formatFileSize(update.assets[0].size) })
                            :
                            window.i18n.t("settings.alerts.update_available.message2", { version: update.name }),
                        [{
                            title: window.i18n.t("common.actions.yes"), style: "default", inline: true, action: () => {
                                Disco.openURL(updateUrl)
                            }
                        }, { title: window.i18n.t("common.actions.no"), style: "default", inline: true, action: () => { } }]
                    );
                    if (update["id"] == localStorage["lastDismissedUpdate"]) localStorage.removeItem(lastDismissedUpdate)

                }

            } else {
                alreadyUpToDate()
            }
            document.querySelector("#updatebutton").classList.remove("loading")
        })
        .catch(error => {
            window.parent.DiscoBoard.alert(
                window.i18n.t("settings.alerts.update_check_failed.title"),
                window.i18n.t("settings.alerts.update_check_failed.message"),
                [{ title: window.i18n.t("common.actions.ok"), style: "default", inline: true, action: () => { } }]
            );
            document.querySelector("#updatebutton").classList.remove("loading")
            console.error('Error:', error)
        });
})
document.querySelectorAll("div.credit-item > p:nth-child(2)").forEach(e => e.addEventListener("flowClick", function (event) {
    Disco.openURL(e.getAttribute("url"))
}))

document.querySelector("#about-app-version").setAttribute("data-i18n-params", `{version: "${Disco.getAppVersion()}"}`)
document.querySelector("#about-webview-version").setAttribute("data-i18n-params", `{version: "${Disco.getWebViewVersion()}"}`)
function incompatibleWebViewVersion(compatible = false) {
    if (compatible) {
        document.querySelector("#about-webview-version").innerHTML += " <span style='color:var(--metro-color-green);'>(compatible)</span>"
    } else {
        document.querySelector("#about-webview-version").innerHTML += " <span style='color:var(--metro-color-red);'>(incompatible)</span>"
    }
}
try {
    var majorVersion = Number(Disco.getWebViewVersion().split(".")[0])
    if (majorVersion < 125 || String(majorVersion) == "NaN") {
        incompatibleWebViewVersion()
    } else {
        incompatibleWebViewVersion(true)
    }
} catch (error) {
    incompatibleWebViewVersion()
}
document.querySelector("#buymeacoffee").addEventListener("flowClick", (e) => {
    Disco.openURL('https://www.buymeacoffee.com/cherryhoax')
})