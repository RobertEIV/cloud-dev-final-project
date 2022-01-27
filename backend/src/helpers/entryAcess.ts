import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { EntryItem } from '../models/EntryItem'
import { EntryUpdate } from '../models/EntryUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('EntrysAccess')

// entry: Implement the dataLayer logic

export class EntryAccess {
    constructor(
        private readonly docClient: DocumentClient =  new XAWS.DynamoDB.DocumentClient(),
        private readonly entryTable = process.env.TODOS_TABLE,
        private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
        private readonly entryTableIndex = process.env.TODOS_CREATED_AT_INDEX
    ){}
    
    async createEntry(entry: EntryItem): Promise<EntryItem> {
        logger.info("Creating entryID: ", entry.entryId)

        await this.docClient.put({
            TableName: this.entryTable,
            Item: entry
        }).promise()

        return entry as EntryItem
    }
    
    async updateEntry(entry: EntryUpdate, userId: string, entryId: string) {
        logger.info("Updating item ", entryId)

        await this.docClient.update({
            TableName: this.entryTable,
            Key: { 
                userId: userId, 
                entryId: entryId 
            },
            UpdateExpression: "set #name=:name, entryDate=:entryDate, done=:done",
            ExpressionAttributeValues: {
                ":name": entry.name,
                ":entryDate": entry.entryDate,
                ":done": entry.done,
            },
            ExpressionAttributeNames: { "#name": "name" }
        }).promise()
    }
    
    async getEntries(userId: string): Promise<EntryItem[]> {
        logger.info("Getting entrys for userID: ", userId)

        const result = await this.docClient.query({
            TableName: this.entryTable,
            IndexName: this.entryTableIndex,
            KeyConditionExpression: 'userId = :paritionKey',
            ExpressionAttributeValues: {
                ':paritionKey': userId
            }
        }).promise()

        const items = result.Items
        return items as EntryItem[]
    }

    async getEntry(userId: string, entryId: string): Promise<EntryItem> {
        logger.info("Getting entry: ", entryId)

        const result = await this.docClient.get({
            TableName: this.entryTable,
            Key: {
                userId, entryId
            }
        }).promise()

        const item = result.Item
        return item as EntryItem
    }
    
    async deleteEntry(userId: string, entryId: string) {
        logger.info("Deleting entry: ", entryId)

        await this.docClient.delete({
            TableName: this.entryTable,
            Key: {
                userId, entryId
            }
        }).promise()
    }

    async attachUrl(imageId: string, entry: EntryItem) {
        logger.info("Attaching URL to item ", entry.entryId)
        
        const attachmentUrl = `https://${this.bucketName}.s3.amazonaws.com/${imageId}`
        await this.docClient.update({ 
            TableName: this.entryTable, 
            Key: {
                entryId: entry.entryId,
                userId: entry.userId
            },
              UpdateExpression: 'set attachmentUrl = :attachmentUrl',
              ExpressionAttributeValues: {
                ':attachmentUrl': attachmentUrl
            } 
        }).promise()
    }
}