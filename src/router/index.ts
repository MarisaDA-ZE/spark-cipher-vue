import { createRouter, createWebHashHistory, RouteLocationNormalized, RouteRecordRaw } from "vue-router";
import { useTokenStore } from "../store/tokenStore";
import { isBank } from "../utils/util/util";


const routesMap: Array<RouteRecordRaw> = [
    {// 主页，默认重定向到密码详情页
        path: "/",
        name: "Index",
        redirect: {
            path: "/password_view"
        },
        meta: {
            title: "火花密码",
            loginRequired: false,
            showHeader: false,
            showDocker: false,
        }
    },
    {// 密码详情页
        path: "/password_view",
        name: "password",
        component: () => import("../views/password/PasswordView.vue"),
        meta: {
            title: "密码管理",
            loginRequired: true,
            showHeader: true,
            showDocker: true,
        }
    },
    {// 图片详情页
        path: "/images_view",
        name: "images",
        component: () => import("../views/image/ImagesView.vue"),
        meta: {
            title: "图片管理",
            loginRequired: true,
            showHeader: true,
            showDocker: true,
        }
    },
    {// 视频管理页
        path: "/videos_view",
        name: "video",
        component: () => import("../views/videos/VideosView.vue"),
        meta: {
            title: "视频管理",
            loginRequired: true,
            showHeader: true,
            showDocker: true,
        }
    },
    {// 文件管理页
        path: "/files_view",
        name: "files",
        component: () => import("../views/file/FilesView.vue"),
        meta: {
            title: "文件管理",
            loginRequired: true,
            showHeader: true,
            showDocker: true,
        }
    },
    {// 个人主页
        path: "/mined_view",
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
        children: [
            {
                path: "more_login",
                name: "moreLogin",
                component: () => import("../pages/login/moreLogin.vue"),
                meta: {
                    title: "更多登录方式",
                }
            }
        ],
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
    const store = useTokenStore();


    const token = store.getToken();
    console.log("to", to.fullPath);
    console.log("from", from.fullPath);
    console.log("token: ", token);


    if (to.meta?.loginRequired) {
        console.log("需要登录");

        const llt = parseInt(localStorage.getItem("lastLoginTime") as string);
        let second = parseInt((((new Date()).getTime() - llt) / 1000).toString()) + 1;
        const overdueSecond = 300;  // 过期时间5分钟

        if(second > overdueSecond -10){
            console.log("请刷新登录时间");
        }

        if (!(second && second < overdueSecond)) {
            console.log("登录过期");
            router.push("/login");
        }

        if (!isBank(token)) {
            next();
        } else {
            console.log("没有token, 跳转到登录页");
            router.push("/login");
        }
    } else {
        console.log("不需要登录");
        next();
    }
});

router.afterEach((to: RouteLocationNormalized) => {
    document.title = to.meta.title as string;
});

export default router;
