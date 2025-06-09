import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faEye, faEyeSlash, faStar as fasStar, faStopwatch, faClock, faList as fasList, faPlus } from '@fortawesome/free-solid-svg-icons'
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

// Agrega los íconos que usarás
library.add(faEye, faEyeSlash, fasStar, farStar, faStopwatch, faClock, fasList, faPlus)

export default FontAwesomeIcon
