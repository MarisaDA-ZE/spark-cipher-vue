import {
    createRouter,
    createWebHashHistory,
    RouteLocationNormalized,
    RouteRecordRaw
} from "vue-router";

const routesMap: Array<RouteRecordRaw> = [
    {// 主页，默认重定向到密码详情页
        path: "/",
        name: "Index",
        redirect: {
            path: "/password-view"
        },
        meta: {
            title: "火花密码",
            loginRequired: false,
            showHeader: false,
            showDocker: false,
        }
    },
    {// 密码详情页
        path: "/password-view",
        name: "password",
        component: () => import("@/views/password/PasswordView.vue"),
        meta: {
            title: "密码管理",
            loginRequired: true,
            showHeader: false,
            showDocker: true,
        },
    },
    {// 密码编辑页面
        path: "/password-view/edit",
        name: "password-edit",
        component: () => import("@/views/password/PasswordEdit.vue"),
        meta: {
            title: "修改密码",
            loginRequired: true,
            showHeader: false,
            showDocker: true,
        }
    },
    {// 图片详情页
        path: "/images-view",
        name: "images",
        component: () => import("../views/image/ImagesView.vue"),
        meta: {
            title: "图片管理",
            loginRequired: true,
            showHeader: false,
            showDocker: true,
        }
    },
    {// 视频管理页
        path: "/videos-view",
        name: "video",
        component: () => import("../views/videos/VideosView.vue"),
        meta: {
            title: "视频管理",
            loginRequired: true,
            showHeader: false,
            showDocker: true,
        }
    },
    {// 个人主页
        path: "/mined-view",
        name: "home",
        component: () => import("../views/mined/MinedView.vue"),
        meta: {
            title: "个人主页",
            loginRequired: true,
            showHeader: false,
            showDocker: true,
        }
    },
    {
        path: "/login",
        name: "login",
        component: () => import("../views/login/LoginView.vue"),
        meta: {
            title: "登录页",
            loginRequired: false,
            showHeader: false,
            showDocker: false,
        }
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes: routesMap
});

router.beforeEach((to, from, next) => {
    next();

    // const store = useAuthorizationStore();
    // const token = store.getToken();
    // if (to.meta?.loginRequired) {
    //     console.log("需要登录");
    //     if (!isBank(token)) {
    //         next();
    //     } else {
    //         console.log("没有token, 跳转到登录页");
    //         router.push("/login")
    //             .then((r: void | NavigationFailure | undefined) => console.log("拦截至: ", r?.to));
    //     }
    // } else {
    //     console.log("不需要登录");
    //     next();
    // }
});

router.afterEach((to: RouteLocationNormalized) => {
    document.title = to.meta.title as string;
});

export default router;
