export const environment = {
    // endpoint: 'http://192.168.1.5:8888',
    endpoint: "http://localhost:8888",
    // endpoint: 'https://node-be.azurewebsites.net',

    apiPath: {
        category: {
            main: "/api/category",
        },
        auth: {
            main: "/api/Auth",
            login: "/api/Auth/Token",
            resetCode: "/api/Auth/ResetCode",
            checkCode: "/api/Auth/CheckResetCode",
            resetPassword: "/api/Auth/ResetPassword",
        },
        deviceToken: {
            main: "/api/DeviceToken",
        },
        user: {
            main: "/api/User",
            toggleActive: "SwitchActive",
        },
        dangerousCase: {
            main: "/api/DangerousCase",
        },
        caseHistoryStatus: {
            main: "/api/CaseHistoryStatus",
        },
        policyLevel: {
            main: "/api/PolicyLevel",
        },
        policy: {
            main: "/api/Policy",
        },
        role: {
            main: "/api/Role",
        },
        configuration: {
            main: "/api/Configuration",
        },
        relative: {
            main: "/api/relative",
            checkOut: "CheckOut",
        },
        student: {
            main: "/api/Student",
            toggleActive: "SwitchActive",
        },
        university: {
            main: "/api/University",
            toggleActive: "SwitchActive",
        },
        notification: {
            main: "/api/Notification",
        },
        securityMan: {
            main: "/api/SecurityGuard",
            building_guard: "/buildingGuard",
            toggleActive: "SwitchActive",
        },
        camera: {
            main: "/api/Camera",
            enable: "/Enable",
            disable: "/Disable",
        },

        building: {
            main: "/api/Building",
            image: "/Image",
        },
        room: {
            main: "/api/Room",
        },
    },
    ai_endpoint: "http://localhost:5000",
    ai_apiPath: {
        // checkYPR: '/faceregister'
        checkYPR: "/faceregisterV2",
    },
    default_avatar_image:
        "https://previews.123rf.com/images/salamatik/salamatik1801/salamatik180100019/92979836-profile-anonymous-face-icon-gray-silhouette-person-male-default-avatar-photo-placeholder-isolated-on.jpg",
    default_image:
        "https://www.tribloo.com/themes/tribloo/assets/images/default-img.gif",
    loading_image:
        "https://assets.motherjones.com/interactives/projects/features/koch-network/shell19/img/loading.gif",
    //Type accepted by input
    SheetJSFT: [
        "xlsx",
        "xlsb",
        "xlsm",
        "xls",
        "xml",
        "csv",
        "txt",
        "ods",
        "fods",
        "uos",
        "sylk",
        "dif",
        "dbf",
        "prn",
        "qpw",
        "123",
        "wb*",
        "wq*",
        "html",
        "htm",
    ]
        .map(function (x) {
            return "." + x;
        })
        .join(","),
    constant_data: {
        error_of_face_angle: 4,
    },
    key: {
        weirdHour: "WEIRD_HOURS_CONFIG",
    },
};
