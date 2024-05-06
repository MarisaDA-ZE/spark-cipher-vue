import router from '@/router/index';
import UnauthorizedException from "./exceptions/UnauthorizedException";

function globalExceptionHandler(error: Error) {
    if (error instanceof UnauthorizedException) {
        // 将用户重定向到登录页面
        router.push('/login').then();
    } else {
        // 处理其他类型的错误
    }
}

export default globalExceptionHandler;
