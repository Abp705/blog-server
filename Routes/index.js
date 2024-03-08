const { userControllerSignin, userControllerLogin, verifyOtp, resendOtp, forgotPassword, resetPassword, userControllerGetAllData, userConterollerUpdateUser } = require("../Controllers/user_controller")
const { create_article, delete_article, update_article, get_article } = require('../Controllers/article_controller')
const { create_category, delete_category, update_category, get_category } = require('../Controllers/category_controller')



async function handleRouts(req, res) {
    const { method, url } = req
    switch (url + method) {
        case '/signinPOST':
            return await userControllerSignin(req, res)
            break;
        case '/getuserGET':
            return await userControllerGetAllData(req, res)
            break;
        case '/updateuserPOST':
            return await userConterollerUpdateUser(req, res)
            break;
        case '/loginPOST':
            return await userControllerLogin(req, res)
            break;
        case '/verifyotpPOST':
            return await verifyOtp(req, res)
            break;
        case '/resendotpPOST':
            return await resendOtp(req, res)
            break;
        case '/forgotpasswordPOST':
            return await forgotPassword(req, res)
            break;
        case '/resetpasswordPOST':
            return await resetPassword(req, res)
            break;
        case '/create_articlesPOST':
            return await create_article(req, res)
            break;
        case '/delete_articlePOST':
            return await delete_article(req, res)
            break;
        case '/update_articlePOST':
            return await update_article(req, res)
            break;
        case '/get_articleGET':
            return await get_article(req, res)
            break;
        case '/create_categoryPOST':
            return await create_category(req, res)
            break;
        case '/delete_categoryPOST':
            return await delete_category(req, res)
            break;
        case '/update_categoryPOST':
            return await update_category(req, res)
            break;
        case '/get_categoryGET':
            return await get_category(req, res)
            break;
        default:
            break;
    }
}

module.exports = { handleRouts }