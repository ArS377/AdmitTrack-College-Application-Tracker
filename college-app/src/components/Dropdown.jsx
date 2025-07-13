import {useState, useRef, useEffect} from 'react'
import './Dropdown.css'

const Dropdown = () => {
    const [dropdownToggled, setDropdownToggled] = useState(false)
    const dropdownRef = useRef(null)
    const [selectedOption, setSelectedOption] = useState(null)

    useEffect(() => {
        function handler(e) {
            if (dropdownRef.current) {
                if (!dropdownRef.current.contains(e.target)) {
                    setDropdownToggled(false)
                }
            }
        }
        document.addEventListener('click', handler)

        return () => {
            document.removeEventListener('click', handler)
        }
    })

    const dropdownOptions = [
        {
            id: 1,
            label: 'Dream'
        },
        {
            id: 2,
            label: 'Reach'
        },
        {
            id: 3,
            label: 'Target'
        },
        {
            id: 4,
            label: 'Safety'
        }
    ]
    return (
        <div className='dropdown' ref={dropdownRef}>
            <button className='toggle' onClick={() => {
                setDropdownToggled(!dropdownToggled)
            }}>
                <span>{selectedOption ? selectedOption.label : 'Select Category'}</span>
                <span>{dropdownToggled ? '∧' : '∨'}</span>
            </button>
            <div className={`options ${dropdownToggled ? 'visible' : ''}`}>
                {dropdownOptions.map((option, index) => {
                    return (
                        <button 
                        className={`${selectedOption && selectedOption.id === option.id ? "selected" : ""}`} 
                        onClick={()=>{
                            setSelectedOption(option)
                            setDropdownToggled(false)
                        }}>
                            {option.label}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default Dropdown