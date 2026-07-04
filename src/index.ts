import axios, { AxiosError } from 'axios'
import * as console from 'node:console'

axios.get('https://task.igor-yuzkiv-dev.tech/project-office-cli/test').then(r => console.log(r.data))
