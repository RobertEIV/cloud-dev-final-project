import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getEntriesForUser as getEntriesForUser } from '../../helpers/entries'
import { getUserId } from '../utils';

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    const userId = getUserId(event)
    const items = await getEntriesForUser(userId)

    // Referenced https://knowledge.udacity.com/questions/658104 for below body
    return {
      statusCode: 200,
      body: JSON.stringify({msg:"TODOs: ",
        items
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
