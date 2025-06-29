import { Router } from 'express'
import aiController from '../controllers/aiController'

const router = Router()

// AI指導関連のルート
function wrapAsync(fn: any) {
  return function (req: any, res: any, next: any) {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

router.post('/analyze', wrapAsync(aiController.analyzeCode))
router.post('/error-help', wrapAsync(aiController.getErrorHelp))
router.post('/question', wrapAsync(aiController.askQuestion))
router.post('/improve', wrapAsync(aiController.suggestImprovements))
router.post('/example-code', wrapAsync(aiController.generateExampleCode))
router.get('/status', wrapAsync(aiController.getStatus))

export default router
