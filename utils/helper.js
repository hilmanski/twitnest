// get first 100 without cutting words
export const makeTitle = (title) => {
    const maxLength = 100

    // remove \n
    title = title.replace(/\n/g, ' ')

    // Check if title only 1 word or less than 100
    if(title.split(' ').length == 1 || title.length < maxLength) {
        return title
    }
    
    let trimmedString = title.substr(0, maxLength);
    trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
    return trimmedString
}