import { Box } from '@mui/material'
import { motion } from 'framer-motion'

// コンポーネントのインポート
import EditorPage from './pages/EditorPage'

function App() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <EditorPage />
      </motion.div>
    </Box>
  )
}

export default App
