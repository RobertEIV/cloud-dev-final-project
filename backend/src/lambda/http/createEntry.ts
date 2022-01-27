import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateEntryRequest } from '../../requests/CreateEntryRequest'
import { getUserId } from '../utils';
import { createEntry } from '../../helpers/entries'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newEntry: CreateEntryRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item
    const userId: string = getUserId(event)
    const createdEntry = await createEntry(newEntry, userId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        item: createdEntry
      })}
  }
)

handler.use(
  cors({
    credentials: true
  })
)
