const appMetadata = {
    appId: 'OTFU3V4TOL6O0RQ0Y0HL63LET',
    appKey: '2S4JIKPJZDTWI3D1DZII8FFHKWIM5LDFTD94NVP4HDNVXUCN7B',
    // appId: 'O0EM52JT2BPOLQLEG2GO2TZOY',
    // appKey: 'HZEBV4D84E8AUVUFU4IHAT0KRM454EJANYCTFQ5LHYAT5EGD0F'
}

function notifyPageChanged() {
    try {
        // fire a page change event to the web sdk
        Hansel.notify().pageChanged();
    } catch (error) {
        // retry page change after this method fails on the initial page load
        setTimeout(() => {
            notifyPageChanged();
        }, 1500);
    }
}

function addProto() {
    if (!Hansel.nudge) {
        Hansel.nudge = {};
    }
    hideAndReposition = (Hansel.nudge.getCurrentNudge = () => {
        return {
            reposition: () => {
                console.log('reposition the nudge!!');
            },
            hide: () => {
                console.log('hide the nudge');
            }
        };
    });
}



function connect() {
    console.log('connecting with sdk');
    let options = new Hansel.SDKConfig();
    // options.disableImplicitPageloadEvent();
    Hansel.initialize(appMetadata.appId, appMetadata.appKey, () => {
        console.log('sdk init')
    }, () => {
        console.log('sdk failed to initialize!!');
    }, options);
}


function getSDKMethod(type) {
    switch (type) {
        case "string":
            return Hansel.getString;
        case "number":
            return Hansel.getNumber;
        case "boolean":
            return Hansel.getBoolean;
        case "JSON":
            return Hansel.getJSON;
    }
}

function logEvent(event) {
    if (Hansel && Hansel.logEvent) {
        console.log('logging event!!', event);
        Hansel.logEvent(event.name, event.vendor, event.properties);
    }
}

function hide() {
    if (Hansel.displayNudge && Hansel.displayNudge.getCurrentNudge) {
        let currentNudge = Hansel.displayNudge.getCurrentNudge();
        if (currentNudge.hide) {
            return currentNudge.hide();
        }
    }
    return {
        reposition: () => {}
    };
}

function reposition(time) {
    if (Hansel.displayNudge && Hansel.displayNudge.getCurrentNudge) {
        let currentNudge = Hansel.displayNudge.getCurrentNudge();
        if (currentNudge.reposition) {
            return currentNudge.reposition(time);
        }
    }
    return {};
}

function dismiss() {
    if (Hansel.displayNudge && Hansel.displayNudge.getCurrentNudge) {
        let currentNudge = Hansel.displayNudge.getCurrentNudge();
        if (currentNudge.dismiss) {
            return currentNudge.dismiss();
        }
    }
    return {};
}

window.addEventListener('load', connect);