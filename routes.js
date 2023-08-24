

const passport = require('passport')
const passportService = require('./service/passport')
const requireSignin = passport.authenticate('local', { session: false })
const requireAuth = passport.authenticate('jwt', { session: false })
const users = require('./controllers/Users')
const center = require('./controllers/Center')
const Dashboard = require('./controllers/Dashboard')

module.exports = function (app) {

    app.get('/', function (req, res) {
        res.send("<h1 style='text-align:center;margin-top:150px; '>^^ API PLAN CENTER ^^</h1>")
    })
    // เกี่ยวกับ Login
    app.post('/signin', requireSignin, users.signin)
    // pull
    // pull 30/10/65
    

    //------------------------------------- backend Konthorn Thonsap ----------------------------------
    // เกี่ยวกับ USER
    app.post('/add-user', requireAuth, center.insUser)
    app.post('/update-user', requireAuth, center.updateUser)
    app.post('/update-status-user', requireAuth, center.updateStatusUser)
    app.post('/edit-password-by-person', requireAuth, center.editPasswordByPerson)
    app.post('/delete-user', requireAuth, center.deleteUser)

    app.get('/get-user-all', requireAuth, center.getUserAll)
    app.get('/get-user/:cid', requireAuth, center.getUserByCid)

    // เกี่ยวกับ Dept
    app.post('/add-dept', requireAuth, center.insDept)
    app.post('/update-dept', requireAuth, center.updateDept)
    app.post('/delete-dept', requireAuth, center.deleteDept)

    app.get('/get-dept-by-id/:id', requireAuth, center.getDeptById)
    app.get('/get-dept-all', requireAuth, center.getDeptAll)

    // เกี่ยวกับ Plan
    app.post('/add-plan', requireAuth, center.insPlan)
    app.post('/update-plan', requireAuth, center.updatePlan)
    app.post('/update-status-plan', requireAuth, center.updateStatusPlan)
    app.post('/approve-status-plan', requireAuth, center.approveStatusPlan)
    app.post('/delete-plan-head', requireAuth, center.deletePlanHead)

    app.get('/get-plan-all', center.getPlanAll)
    app.get('/get-plan-by-id/:id', requireAuth, center.getPlanById)
    app.get('/get-approve-plan-by-id/:id', requireAuth, center.getApprovePlanById)
    
    // เกี่ยวกับ Detail Plan
    
    app.post('/add-activity', requireAuth, center.insActivity)
    app.post('/add-psi', requireAuth, center.insPSI)
    app.post('/add-target', requireAuth, center.insTarget)
    app.post('/add-bs', requireAuth, center.insBS)
    app.post('/add-bud', requireAuth, center.insBUD)
    app.post('/delete-activity', requireAuth, center.deleteActivity)
    app.post('/delete-psi', requireAuth, center.deletePSI)
    app.post('/delete-target', requireAuth, center.deleteTarget)
    app.post('/delete-bs', requireAuth, center.deleteBS)
    app.post('/delete-bud', requireAuth, center.deleteBUD)
    
    app.get('/get-activity-by-id/:id', requireAuth, center.getActivityById)
    app.get('/get-project-success-indicator-by-id/:id', requireAuth, center.getProjectSuccessIndicatorById)
    app.get('/get-target-by-id/:id', requireAuth, center.getTargetById)
    app.get('/get-budget-source-by-id/:id', requireAuth, center.getBudgetSourceById)
    app.get('/get-budget-usage-detail-by-id/:id', requireAuth, center.getBudgetUsageDetailById)
    
    app.get('/get-4exc-all', requireAuth, center.get4excAll)
    app.get('/get-plan-by-id-head/:id', requireAuth, center.getPlanByIdHead)
    app.get('/get-project-by-id-head/:id', requireAuth, center.getProjectByIdHead)
    app.get('/get-indicator-by-id-head/:id', requireAuth, center.getIndicatorByIdHead)
    app.get('/get-policy', requireAuth, center.getPolicy)
    //------------------------------------- backend Konthorn Thonsap ----------------------------------


    
    app.get('/get-money-total', Dashboard.MoneyTotal)
    app.get('/get-money-success', Dashboard.MoneySuccess)
    app.get('/get-money-between', Dashboard.MoneyBetween)

    app.get('/get-project-total', Dashboard.ProjectTotal)
    app.get('/get-project-success', Dashboard.ProjectSuccess)
    app.get('/get-project-between', Dashboard.ProjectBetween)
    app.get('/get-project-not', Dashboard.ProjectNot)
    
    
}