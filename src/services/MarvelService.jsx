const apiBase = "https://gateway.marvel.com:443/v1/public/"
const apiKey = "apikey=31072d65928ddea3f2cb75dd318cca95"
const BASED_OFFSET = 210

export const getResource = async (url) => {
        let res = await fetch(url)
        if(!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`)
        }

        return await res.json()
    }

export const getAllCharacters = async (offset = BASED_OFFSET) => {
      const res = await getResource(`${apiBase}characters?limit=9&offset=${offset}&${apiKey}`)

      return res.data.results.map(transformCharacter)
    }

export const getCharacter = async (id) => {
        const res = await getResource(`${apiBase}characters/${id}?${apiKey}`)

        return transformCharacter(res.data.results[0])
      }

export const transformCharacter = (char) => {
    return {
        id: char.id,
        name: char.name,
        description: char.description,
        thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
        homepage: char.urls[0].url,
        wiki: char.urls[1].url,
        comics: char.comics.items
    }
}