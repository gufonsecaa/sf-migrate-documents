require('dotenv').config()

import { AppDocument } from './appDocument'

const application = new AppDocument()
application.init()
