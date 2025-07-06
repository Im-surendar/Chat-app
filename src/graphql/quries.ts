import { gql } from "@apollo/client";

export const GET_LATESTMSG = gql`
    query FetchLatestMessages($channelId:String!){
    fetchLatestMessages(
    channelId:$channelId    
    ){
    messageId
    text
    datetime
    userId
  }
}
`

export const Fetch_MORE_MESSAGES = gql`
query FecthMoreMessages(
$channelId:String!
$messageId:String!
$old:Boolean!
){
  fetchMoreMessages(
    channelId:$channelId
  	messageId:$messageId
    old:$old
  ){
    messageId
	datetime
    text
    userId
  }
}
`