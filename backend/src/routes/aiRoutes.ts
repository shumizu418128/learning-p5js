import { Router } from 'express'
import aiController from '../controllers/aiController'

const router = Router()

// AI指導関連のルート
router.post('/analyze', aiController.analyzeCode)
router.post('/error-help', aiController.getErrorHelp)
router.post('/question', aiController.askQuestion)
router.post('/improve', aiController.suggestImprovements)
router.post('/example-code', aiController.generateExampleCode)
router.get('/status', aiController.getStatus)

export default router
