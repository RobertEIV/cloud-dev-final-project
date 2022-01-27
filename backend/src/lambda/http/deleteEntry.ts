import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteEntry } from '../../helpers/entries'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const entryId = event.pathParameters.entryId
    // TODO: Remove a TODO item by id
    const userId: string = getUserId(event)
    const deleted = await deleteEntry(userId, entryId)
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        item: deleted
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
