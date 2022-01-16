import { bounce } from 'react-animations';
import styled, {keyframes} from 'styled-components';
import React, {Component } from 'react';

const Bounce = styled.div`animation: 1s ${keyframes `${bounce}`} infinite`;
/*const bounceAnimation = keyframes`${bounce}`;

const Bounce = styled.div`
  animation: 1s ${bounceAnimation};
`;*/
class ReactAnimations extends Component{
    render()
    {
        return(
           <Bounce> <img src={this.props.source} width={this.props.width} height={this.props.height} /> </Bounce>
          /* <Bounce> <h1> bounce   </h1></Bounce>*/
        );
    }   
}
export default ReactAnimations;