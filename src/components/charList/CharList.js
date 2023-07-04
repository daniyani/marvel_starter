import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getAllCharacters } from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';


const CharList = ({ onCharSelected }) => {
    const [chars, setChars] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [activeChar, setActiveChar] = useState(null)
    const [showMoreLoading, setShowMoreLoading] = useState(false)
    const [offset, setOffset] = useState(210)
    const [charsEnded, setCharsEnded] = useState(false)

   const onError = () => {
        setLoading(false)
        setError(true)
    }

   const onCharsLoaded = (newChars) => {
        let ended = false 
        if(newChars.length < 9) {
            ended = true
        }

        setChars(prev => [ ...prev, ...newChars ])
        setLoading(false)
        setShowMoreLoading(false)
        setOffset(prev => prev + 9)
        setCharsEnded(ended)
    }

   const onRequest = (offset) => {
        onCharListLoading()
        getAllCharacters(offset)
            .then(res => onCharsLoaded(res))
            .catch(onError)
    }

    const handleActiveChar = (id) => {
        onCharSelected(id)
        setActiveChar(id)
    }
    
   const onCharListLoading = () => {
        setShowMoreLoading(true)
    }

    useEffect(() => {
        onRequest()
    }, [])
 
        return (
            <div className="char__list">
              {isLoading ? <Spinner /> : null}
              {error ? <ErrorMessage /> : null}
              {!error && !isLoading  ? 
                <View 
                    chars={chars} 
                    activeChar={activeChar}  
                    handleActiveChar={handleActiveChar}
                    showMoreLoading={showMoreLoading}
                    offset={offset}
                    onRequest={onRequest}
                    charsEnded={charsEnded}
                /> 
                : null}   
            </div>
        )
}

const View = ({ chars, handleActiveChar, activeChar, showMoreLoading, offset, onRequest, charsEnded }) => {
    return (
        <>
            <ul className="char__grid">
                { chars.map(item => {
                    return (
                    <li 
                      className={`char__item ${activeChar === item.id ? "char__item_selected" : ""}`} 
                      key={item.id} 
                      onClick={() => handleActiveChar(item.id)}
                    >
                        <img src={item.thumbnail} alt={item.name}/>
                        <div className="char__name">{item.name}</div>
                    </li>
                    )
                }) }
            </ul>
            <button 
            className="button button__main button__long"
            disabled={showMoreLoading}
            style={{"display": charsEnded ? "none" : "block"}}
            onClick={() => onRequest(offset)}
            >
                    <div className="inner">load more</div>
            </button>
        </>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func
}

export default CharList;