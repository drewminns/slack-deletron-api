import { NowRequest, NowResponse } from '@vercel/node'

// export const allowCors = (fn: any) => async (req: NowRequest, res: NowResponse) => {
//   res.setHeader('Access-Control-Allow-Credentials', true)
//   res.setHeader('Access-Control-Allow-Origin', '*')
//   // another option
//   // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
//   res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
//   )
//   if (req.method === 'OPTIONS') {
//     res.status(200).end()
//     return
//   }
//   return await fn(req, res)
// }
