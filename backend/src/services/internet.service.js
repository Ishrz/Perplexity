import {tavily as Tavily} from "@tavily/core"


const tavily = Tavily({
    apiKey:process.env.TAVILY_API_KEY
})


export const SearchInternet =async ({query}) =>{
    const response = await tavily.search(query,{
        maxResults:5
    })

    return JSON.stringify(response)
}