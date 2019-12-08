import React, { useEffect } from 'react';
import { WithContext as Tags } from 'react-tag-input';
import './SearchBar.css';



const operators = [
    {id: 'AND', text: 'AND'},
    {id: 'OR', text: 'OR'},
    {id: 'LIKE', text: 'LIKE'},
    {id: '=', text: '='},
    {id: '>', text: '>'},
    {id: '>=', text: '>='},
    {id: '<', text: '<'},
    {id: '<=', text: '<='},
    {id: '<>', text: '<>'},
];

const KeyCodes = {
    comma: 188,
    enter: 13,
  };
   
const delimiters = [KeyCodes.comma, KeyCodes.enter];



function SearchBar({ classes, fields, handleQuery }) {
    const [tags, setTags] = React.useState([]);


    useEffect(() => {
        let queryStr = tags.map(({ id, text }) => id).join(' ')
        handleQuery(queryStr);
    }, [tags])



    const handleDelete = (pos) => {
        setTags(tags.filter((tag, idx) => idx !== pos));
    }
 
    const handleAddition = (tag) => {
        setTags([...tags, tag]);
    }
 
    const handleDrag = (tag, currPos, newPos) => {
        const newTags = tags.slice();
 
        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);
 
        // re-render
        setTags(newTags);
    }

    return (
        <Tags 
            inline
            tags={tags}
            suggestions={[...fields, ...operators]}
            handleDelete={handleDelete}
            handleAddition={handleAddition}
            handleDrag={handleDrag}
            delimiters={delimiters}
            autocomplete
            placeholder='Searching..'
            inputFieldPosition="top"
            minQueryLength={1}
        />
    )
}

export default SearchBar;
