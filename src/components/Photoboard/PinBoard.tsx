import * as React from 'react';
import Pin from './Pin'
import '../styles/PinBoard.css'
import { examplePin } from '../../AssetsBase/Pins';

const PinBoard: React.FC = () => {
    return (
        <div className='pin_container'>
            {examplePin.map((pin, index) => (
                <Pin key={index} pin={pin} />
            ))}
        </div>
    );
  };
  
  export default PinBoard;
