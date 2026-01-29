const DiscoMockInstance = !window.Disco
window.DiscoMockInstance = DiscoMockInstance
import { DiscoMock, BuildConfigMock } from "./scripts/discoMock.js";
window.DiscoRole = "main"
if (DiscoMockInstance) {
    //window.Disco = new DiscoMock("./mock/apps.json")
    window.Disco = new DiscoMock("./mock/apps.json")
    await Disco.initializeApps()
    window.BuildConfig = new BuildConfigMock()
    document.body.classList.add("disco-mock")
}

import startUpSequence from "./scripts/startUpSequence";
import jQuery from "jquery";
window.$ = jQuery
import appTransition from "./scripts/appTransition.js";
import "./scripts/flowTouch.js";
import { DiscoScroll, DiscoSlide } from "./scripts/overscrollFramework.js";
import { boardMethods } from "./scripts/DiscoBoard";
import imageStore from "./scripts/imageStore.js";
import detectDeviceType from "./scripts/detectDeviceType";
import DiscoBoard from "./scripts/DiscoBoard";
import iconPackConverter from "./scripts/iconPack.js";
import "./scripts/pages/appList.js"
import "./scripts/pages/tileList.js"
import { normalize } from 'normalize-diacritics-es';
import liveTileManager from "./scripts/liveTileManager.js";
import { discoThemes } from "./scripts/DiscoProperties.js";
import applyOverscroll from "./scripts/overscrollFramework.js";
import { } from "./scripts/updateManager.js"
import StyleManager from "./scripts/styleManager.js";
const styleManagerInstance = new StyleManager()
window.styleManagerInstance = styleManagerInstance
window.normalizeDiacritics = (input = "") => {
    return normalize(input)
}
import BScroll from "better-scroll";
import i18n from "./scripts/localeManager.js";
DiscoBoard.backendMethods.setUIScale(1, true)

window.imageStore = imageStore

var allappsarchive = []
window["allappsarchive"] = allappsarchive

window.appTransition = appTransition
window.DiscoBoard = DiscoBoard
const scrollers = {
    main_home_scroller: new DiscoSlide('#main-home-slider', {
        scrollX: true,
        scrollY: false,
        startX: -window.innerWidth
    }),
    tile_page_scroller: new DiscoScroll('#main-home-slider > div > div:nth-child(1) > div.inner-page', {
        scrollX: false,
        scrollY: true,
        mouseWheel: true,
    }),
    app_page_scroller: new DiscoScroll('#main-home-slider > div > div:nth-child(2) > div > div.app-list', {
        scrollX: false,
        scrollY: true,
        mouseWheel: true,
        scrollbar: true
    }),
    letter_selector_scroller: new DiscoScroll('div.letter-selector', {
        scrollX: false,
        scrollY: true,
        mouseWheel: true,
    }),
}
window.scrollers = scrollers

window.console.image = function (url, size = 100) {
    if (typeof url == "string") {
        const image = url
        var style = [
            'font-size: 1px;',
            'padding: ' + this.height / 100 * size + 'px ' + this.width / 100 * size + 'px;',
            'background: url(' + url + ') no-repeat;',
            'background-size: contain;'
        ].join(' ');
        console.log('%c ', style);
    } else {
        const image = new Image();
        image.src = url;
        image.onload = function () {
            var style = [
                'font-size: 1px;',
                'padding: ' + this.height / 100 * size + 'px ' + this.width / 100 * size + 'px;',
                'background: url(' + url + ') no-repeat;',
                'background-size: contain;'
            ].join(' ');
            console.log('%c ', style);
        };
    }
};

$(window).on("systemInsetsChange", function () {
    DiscoBoard.backendMethods.refreshInsets()
})
DiscoBoard.backendMethods.refreshInsets()
$(window).on("resize", () => {
    $(":root").css({ "--window-width": window.innerWidth + "px", "--window-height": window.innerHeight + "px", "--window-hypotenuse": (Math.sqrt(Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2))) + "px", "--app-transition-scale": window.innerHeight / 850 })
})
const appTransitionScale = () => window.innerHeight / 850 / 2 + .5

$(":root").css({ "--window-width": window.innerWidth + "px", "--window-height": window.innerHeight + "px", "--window-hypotenuse": (Math.sqrt(Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2))) + "px", "--app-transition-scale": appTransitionScale })

scrollers.main_home_scroller.on("slideWillChange", function (e) {
    if (e.pageX == document.body.classList.contains("rtl") ? 1 : 0) {
        if (DiscoBoard.backendMethods.navigation.lastPush.change == "appMenuOpened") {
            DiscoBoard.backendMethods.navigation.back()
        }
        $("#search-icon").removeClass("shown");
    } else {
        DiscoBoard.backendMethods.navigation.push("appMenuOpened", () => { }, () => {
            scrollers.main_home_scroller.scrollTo(document.body.classList.contains("rtl") ? -window.innerWidth : 0)
        })
        $("#search-icon").addClass("shown");
    }
})

// Add scroll listener for more granular control
/*TURN ON
scrollers.main_home_scroller.scroller.translater.hooks.on("beforeTranslate", function (p) {
    const position = scrollers.main_home_scroller.x;
    if (position < document.body.classList.contains("rtl") ? (-window.innerWidth + 10) : -10) {
        $("#search-icon").addClass("shown");
    } else {
        $("#search-icon").removeClass("shown");
    }
});*/

function getRandomMultiplier() {
    // Returns -1, 0, or 1
    return Math.floor(Math.random() * 3) - 1;
}

function createShakeKeyframes(n) {
    const firsttwo = [getRandomMultiplier(), getRandomMultiplier()]
    return `
        @keyframes home-edit-mode-shake${n} {
            0% {
                transform: scale(var(--shake-scale-distance)) translate(calc(${firsttwo[0]} * var(--shake-distance)), calc(${firsttwo[1]} * var(--shake-distance)));
            }
            33% {
                transform: scale(var(--shake-scale-distance)) translate(calc(${getRandomMultiplier()} * var(--shake-distance)), calc(${getRandomMultiplier()} * var(--shake-distance)));
            }
            66% {
                transform: scale(var(--shake-scale-distance)) translate(calc(${getRandomMultiplier()} * var(--shake-distance)), calc(${getRandomMultiplier()} * var(--shake-distance)));
            }
            100% {
                transform: scale(var(--shake-scale-distance)) translate(calc(${firsttwo[0]} * var(--shake-distance)), calc(${firsttwo[1]} * var(--shake-distance)));
            }
        }
    `;
}

function generateShakeAnimations() {
    return
    document.querySelectorAll("style.shake-anim-styles").forEach(i => i.remove())

    const styleSheet = document.createElement('style');
    styleSheet.classList.add("shake-anim-styles")
    document.head.appendChild(styleSheet);
    $("div.disco-home-tile").each((index, element) => {
        element.style.setProperty("--shake-duration", (Math.floor(Math.random() * 6) + 3) + "s")
    })
    for (let i = 0; i <= 5; i++) {

        const keyframes = createShakeKeyframes(i);

        styleSheet.innerHTML += keyframes;
    }
}

window.generateShakeAnimations = generateShakeAnimations

window.addEventListener("activityPause", () => {
    clearTimeout(window.appTransitionLaunchError)
    //document.body.style.visibility = "hidden"
    document.body.classList.add("activity-paused")
})
window.addEventListener("activityResume", () => {
    document.body.classList.remove("activity-paused")
    setTimeout(() => {
        //document.body.style.removeProperty("visibility")

        appTransition.onResume()

    }, 200);
})


if (!!localStorage.getItem("accentColor")) DiscoBoard.backendMethods.setAccentColor(localStorage.getItem("accentColor"), true)
startUpSequence([
    (next) => {
        // Skip setup in theme-editor mode
        const isThemeEditor = location.search.includes("theme-editor");
        if (!isThemeEditor && DiscoBoard.backendMethods.setupNeeded()) {
            location.href = new URL("./welcome.html", location).href
        } else {

            if (location.search.includes("firstload")) {
                DiscoBoard.backendMethods.setUIScale(1)
                document.querySelector("#loader").style.visibility = "visible"
                document.querySelector("#loader").classList.add("enter")

                setTimeout(() => {
                    document.querySelector("#loader").classList.remove("enter")

                    next()
                }, 500)

            } else next();
        }
    },
    (next) => {

        DiscoBoard.backendMethods.reloadAppDatabase()
        next()
    },
    (next) => {
        window.iconPackDB = {}
        iconPackConverter.forEach(icon => {
            icon.apps.forEach(packageName => {
                window.iconPackDB[packageName] = { icon: icon.icon, accent: icon["accent"] }
            });
        });
        next()
    },
    /*    (next) => {
    
            DiscoBoard.alert(
                "Warning!",
                "WebView you are using is old/unsupported!",
                [{ title: "Ok", style: "default", action: next }]
            );
    
        },*/
    (next) => {
        //Load customization
        if (!!localStorage.getItem("accentColor")) DiscoBoard.backendMethods.setAccentColor(localStorage.getItem("accentColor"), true)
        if (!!localStorage.getItem("tileColumns")) DiscoBoard.backendMethods.setTileColumns(Number(localStorage.getItem("tileColumns")), true)
        if (!!localStorage.getItem("theme")) DiscoBoard.backendMethods.setTheme(Number(localStorage.getItem("theme")), true)
        if (!!localStorage.getItem("reducedMotion")) DiscoBoard.backendMethods.setReduceMotion(localStorage.getItem("reducedMotion") == "true", true)
        if (!!localStorage.getItem("highContrast")) DiscoBoard.backendMethods.setHighContrast(localStorage.getItem("highContrast") == "true", true)
        if (!!localStorage.getItem("alternativeWallpaper")) DiscoBoard.backendMethods.wallpaper.alternative()
        if (!!localStorage.getItem("font")) DiscoBoard.backendMethods.font.set(localStorage.getItem("font"), true)
        if (!!localStorage.getItem("rotationLock")) Disco.setDisplayOrientationLock(localStorage.getItem("rotationLock"))
        if (localStorage.getItem("hapticFeedback") == "false") Disco.triggerHapticFeedback("DISABLED")
        if (localStorage.getItem("iconPack")) Disco.applyIconPack(localStorage.getItem("iconPack"))
        // Load per-app icon pack preferences
        if (localStorage.getItem("iconPackPerApp")) {
            try {
                const iconPackPerApp = JSON.parse(localStorage.getItem("iconPackPerApp"));
                Object.entries(iconPackPerApp).forEach(([appPackageName, iconPackPackageName]) => {
                    if (iconPackPackageName && iconPackPackageName.trim() !== "") {
                        Disco.applyIconPackPerApp(appPackageName, iconPackPackageName);
                    }
                });
            } catch (error) {
                console.log("Error loading per-app icon pack preferences:", error);
            }
        }
        if (localStorage.getItem("textDirection") == "rtl" || localStorage.getItem("forceRTL") == "true") DiscoBoard.backendMethods.setTextDirection("rtl", true);
        //if (!!localStorage.getItem("packageManagerProvider")) DiscoBoard.backendMethods.packageManagerProvider.set(Number(localStorage.getItem("packageManagerProvider")), true)
        next()
    },
    (next) => {
        if (!!localStorage.getItem("accentColor")) DiscoBoard.backendMethods.setAccentColor(localStorage.getItem("accentColor"), true)
        Disco.appReady()
        next();
    },
    (next) => {
        DiscoBoard.backendMethods.navigation.push("homescreen", () => { }, () => { })
        if (Disco.constructor.toString().includes("DiscoMock")) {
            setTimeout(next, 500);
        } else {
            next()
        }
    },
    (next) => {
        detectDeviceType();
        DiscoBoard.backendMethods.reloadApps()
        window.scrollers.tile_page_scroller.refresh()
        window.scrollers.app_page_scroller.refresh()
        next()
    },
    (next) => {
        const letter_selector_entries = ["#abcdefghijklmnopqrstuvwxyz"]
        const groupedEntries = [];
        for (let i = 0; i < letter_selector_entries[0].length; i += 4) {
            groupedEntries.push(letter_selector_entries[0].slice(i, i + 4));
        }
        const letterSelectorDiv = $('.letter-selector > div');
        groupedEntries.forEach(group => {
            const $rowDiv = $('<div>', { class: 'letter-selector-row' });
            for (let letter of group) {
                const $letterDiv = $('<div>', { class: 'letter-selector-letter', text: letter });
                $rowDiv.append($letterDiv);
            }
            letterSelectorDiv.append($rowDiv);
        });
        next()
    },
    (next) => {
        try {
            DiscoBoard.backendMethods.homeConfiguration.load()
        } catch (error) {
            alert("Your home screen was reset because of a fatal error :( Please report this:\n" + error.message)
        }
        next()
    },
    async (next) => {
        const wallpaper = await imageStore.hasImage("wallpaper")
        if (wallpaper) {
            DiscoBoard.backendMethods.wallpaper.loadBlob(await imageStore.loadImage("wallpaper"))
        }
        next()
    },
    async (next) => {
        const baseURL = new URL("./", location).href
        DiscoBoard.boardMethods.liveTiles.init = {
            alarms: await liveTileManager.registerLiveTileProvider(new URL("./assets/defaultlivetiles/alarms.js", baseURL).href),
            people: await liveTileManager.registerLiveTileProvider(new URL("./assets/defaultlivetiles/people.js", baseURL).href),
            photos: await liveTileManager.registerLiveTileProvider(new URL("./assets/defaultlivetiles/photos.js", baseURL).href),
            notifications: await liveTileManager.registerLiveTileProvider(new URL("./assets/defaultlivetiles/notifications.js", baseURL).href),
            //weather: await liveTileManager.registerLiveTileProvider(new URL("./assets/defaultlivetiles/weather.js", baseURL).href),
            example: await liveTileManager.registerLiveTileProvider(new URL("./assets/defaultlivetiles/helloworld.js", baseURL).href)
        }
        DiscoBoard.backendMethods.defaultLiveTiles.refresh();
        window.contactsCache = JSON.parse(Disco.getContacts()).map(e => {
            e.avatarURL = Disco.getContactAvatarURL(e.id)
            return e
        })
        window.photosCache = JSON.parse(Disco.getPhotos()).map(e => {
            e.photoURL = Disco.getPhotoURL(e.id)
            return e
        })
        DiscoBoard.boardMethods.liveTiles.refresh()
        next()
    }
],
    function () {
        DiscoBoard.backendMethods.setAccentColorShades()
        DiscoBoard.boardMethods.finishLoading()
        setTimeout(() => {
            DiscoBoard.backendMethods.refreshStyles()
            if (!!localStorage.getItem("UIScale")) DiscoBoard.backendMethods.setUIScale(Number(localStorage.getItem("UIScale")), true); else DiscoBoard.backendMethods.setUIScale(.8, true)
            // Refresh tiles to apply any saved preferences
            DiscoBoard.backendMethods.refreshAllTiles()
        }, 500);
    }
)



//DiscoBoard.alert("CAK", BuildConfig.CAK())


window.liveTileManager = liveTileManager


await i18n.init()
i18n.translateDOM()

window.addEventListener("deepLink", (e) => {
    console.log(e)
    const url = new URL(e.detail.url)
    console.log("url", url)
    setTimeout(() => {
        if (url.protocol == "disco:") {
            console.log("hoba")
            if (url.pathname == "settings") {
                if (!window.doubleTapOverride) Disco.launchApp("disco.internal.settings")
                return;
            }
            if (url.searchParams.size) {
                if (url.searchParams.get("installStyle")) {
                    if (!window.doubleTapOverride) Disco.launchApp(`disco.internal.tweaks?installStyle=${url.searchParams.get("installStyle")}`)
                    return;
                }
            }
        }
    }, 1000);
})

let lastTap = 0;
const doubleTapDelay = 300;

window.addEventListener("pointerdown", (e) => {
    if (localStorage.doubleTapSleep != "true") return
    if (Date.now() - lastTap < doubleTapDelay) {
        window.doubleTapOverride = true
        clearTimeout(window.doubleTapOverrideTimeout)
        window.doubleTapOverrideTimeout = setTimeout(() => {
            delete window.doubleTapOverride
            delete window.doubleTapOverrideTimeout
        })
        if (Disco.checkPermission("ACCESSIBILITY") === "true") {
            Disco.requestScreenLock()
            console.log("double tap sleep")
        } else {
            Disco.requestPermission("ACCESSIBILITY")
            Disco.showToast("You need to enable the accessibility service to use this feature.")
            console.log("requesting permission")
        }

    }
    lastTap = Date.now();
})

/*scrollers.main_home_scroller.scroller.animater.hooks.on(
    "time",
    (duration) => {
        console.log("duration", duration, scrollers.main_home_scroller.x)
    }
);*/
const slideContent = document.querySelector("#main-home-slider > div.slide-content");
const mainHomeSlider = document.querySelector("#main-home-slider");

function updateShadeOpacity(x) {
    const newOpacity = (-x / window.innerWidth);
    window.requestAnimationFrame(() => {
        slideContent.style.setProperty("--shade-opacity", newOpacity);
    });
}
let lastUpdateTime = 0;
let shadeOpacityLast = null;

function shadeOpacity(timestamp) {
    // Limit updates to roughly 60fps (~16ms between frames)
    if (timestamp - lastUpdateTime > 16) {
        const x = slideContent.getBoundingClientRect().left;
        if (!document.body.classList.contains("activity-paused") && x !== shadeOpacityLast) {
            const newOpacity = (-x / window.innerWidth);
            const isLightMode = document.body.classList.contains("light-mode")
            const c = isLightMode ? 255 : 0
            slideContent.style.setProperty("background-color", `rgba(${c}, ${c}, ${c}, ${newOpacity * .75})`);
            mainHomeSlider.style.setProperty("background-position", `calc(50% + ${(x / window.innerWidth) * 100 - 50}px) 50%`)

        }
        shadeOpacityLast = x;
        lastUpdateTime = timestamp;
    }
    requestAnimationFrame(shadeOpacity);
}
requestAnimationFrame(shadeOpacity);