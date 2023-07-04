import { Component } from "react"
import PropTypes from 'prop-types';
import { getCharacter } from "../../services/MarvelService";
import  Spinner from "../spinner/Spinner"
import  ErrorMessage  from "../errorMessage/ErrorMessage" 
import Skeleton from "../skeleton/Skeleton" 

import './charInfo.scss';

class CharInfo extends Component {
    state = {
        char: null,
        isLoading: false,
        error: false
    }

    onError = () => {
        this.setState({ error: true })
    }

    onLoading = () => {
        this.setState({ isLoading: true })
    }

    selectChar = (id) => {
        if(!id) {
            return null
        }
        this.onLoading()
        getCharacter(id)
            .then(res => this.setState({ char: res, isLoading: false, error: false }))
            .catch(this.onError)
    }

    componentDidMount = () => {
        this.selectChar(this.props.charId)
    }

    componentDidUpdate = (prevProps) => {
        if(this.props.charId !== prevProps.charId) {
            this.selectChar(this.props.charId)
        }
    }

    render() {
        const {char, isLoading, error} = this.state
        const skeleton = char || error || isLoading ? null : <Skeleton />
        const loading = isLoading ? <Spinner /> : null
        const errorMessage = error ? <ErrorMessage /> : null
        const content = !error && !isLoading && char ? <View char={char}/> : null

        return (
            <div className="char__info">
              {skeleton}
              {loading}
              {errorMessage}
              {content}
            </div>
        )
    }
}


const View = ({ char }) => {
    const { name, thumbnail, description, homepage, wiki, comics } = char
    const filteredComics = comics.filter((_, i) => i < 10)

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name}/>
                    <div>
                        <div className="char__info-name">{name}</div>
                        <div className="char__btns">
                            <a href={homepage} className="button button__main">
                                <div className="inner">Homepage</div>
                            </a>
                            <a href={wiki} className="button button__secondary">
                                <div className="inner">Wiki</div>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="char__descr">
                    {description}
                </div>
                <div className="char__comics">Comics:</div>
                <ul className="char__comics-list">
                    { filteredComics.length ? filteredComics.map((item, i) => {
                        return (
                            <li className="char__comics-item" key={i}>
                                {item.name}
                            </li>
                        )
                    }) : <div>This character has no comics</div> }
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    selectedChar: PropTypes.number
}

export default CharInfo;