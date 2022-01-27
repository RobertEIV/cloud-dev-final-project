import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createAttachmentPresignedUrl } from '../../helpers/entries'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const entryId = event.pathParameters.entryId
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    const userId: string = getUserId(event)
    const presignedUrl: string = await createAttachmentPresignedUrl(userId, entryId)
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl: presignedUrl
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
