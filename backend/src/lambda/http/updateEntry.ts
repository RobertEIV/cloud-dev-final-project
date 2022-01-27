import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateEntry } from '../../helpers/entries'
import { UpdateEntryRequest } from '../../requests/UpdateEntryRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const entryId = event.pathParameters.entryId
    const updatedEntry: UpdateEntryRequest = JSON.parse(event.body)
    // TODO: Update a TODO item with the provided id using values in the "updatedEntry" object
    const userId: string = getUserId(event)
    const updated = await updateEntry(userId, entryId, updatedEntry)

    return {
      statusCode: 200,
      body: JSON.stringify({
        item: updated
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
