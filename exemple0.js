'use strict';

//import {Machine, interpret} from 'xstate';
import { Machine } from 'xstate';

// on passe une configuration de machine 
// On a deux choix, sois c'est une machine d'état 
//sois c'est une statechart 

const promiseMachine = Machine({
    id: 'promise',

    // l'état initial, on commence par cette état 
    // pour l'état initial, il y a pas de entrant
    initial: 'pending',
    states: {
        // ce sont les états que nous avons défini 
        //(pending, resolved, rejected)
        pending: {
            on: {
                // RESOLVE: c'est l'action pour transmettre à un autre état
                // 'resolved': c'est l'état suivant 
                // ce qui signifie c'est que si on est l'état pending actuellement
                // et il y a un événement de RESOLVE, on passe à l'état 'resolved' 
                RESOLVE: 'resolved',
                REJECT: 'rejected'
            }
        },
        // la définition d'état finie
        // pour cet état, il n'y a pas de sortie
        resolved: {
            type: 'final'
        },
        rejected: {
            type: 'final'
        }
    }
});

// interpret: créer un instance de la machine d'état
const promiseService = interpret(promiseMachine)
    // onTransition quand l'état va changer dans un autre état
    // on affiche la valeur d'état
                        .onTransition(state => console.log(state.value));


// déclencher le service 
promiseService.start();

// la machine est à l'état initial: 'pending'
// quand on a envoie l'évenement 'RESOLVE', le service va
// passer à l'état suivant 'RESOLVE'
promiseService.send('RESOLVE');