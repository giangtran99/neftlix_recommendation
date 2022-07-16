import React from 'react';
import ReactDOM from 'react-dom';
import SelectPartners from '../../components/Select/Partners';
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SelectPartners />, div);
});
