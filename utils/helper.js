// get first 100 without cutting words
export const makeTitle = (title) => {
    const maxLength = 50

    // remove \n
    title = title.replace(/\n/g, ' ')
    title = title.replace('[twitnest:media]', ' ') // for embed media helper only in body used

    // Check if title only 1 word or less than 100
    if(title.split(' ').length == 1 || title.length < maxLength) {
        return title
    }
    
    let trimmedString = title.substr(0, maxLength);
    trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
    return trimmedString
}

export const makeSnippet = (text) => {
    const maxLength = 150

    // remove \n
    text = text.replace(/\n/g, ' ')
    text = text.replace('[twitnest:media]', ' ') // for embed media helper only in body used

    // Check if text only 1 word or less than 100
    if(text.split(' ').length == 1 || text.length < maxLength) {
        return text
    }
    
    let trimmedString = text.substr(0, maxLength);
    trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
    return trimmedString
}