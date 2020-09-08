// A State object instance is JSON-serializable and has 
// the following properties
//   value: the current state value
//   context: the current context of this state
//   event: the event object that triggered the transition 
//   to this state 
//   actions: an array of actions to be executed
//   activities: a mapping of activities to true if
//   the activity started, or false if stopped 
//   history: the previous State instance 
//   meta: any static meta data 
//   defined on the meta property of the state node
//   
//   done: whether the state indicated a final state
//
//
//
//
// Array.some() tests whether at least one element 
// in the array passes the test implemented 
// by the provided function 

const { interpret } = require("xstate");


const answeringMachine = Machine({
    initial: 'unanswered',
    states: {
      unanswered: {
        on: {
          ANSWER: 'answered'
        }
      },
      answered: {
        type: 'final'
      }
    }
  });
  

// destructing assignment
  const { initialState } = answeringMachine;
  initialState.done; // false
  

// the method transition() prend deux arguments 
// l'état de parti et l'event de transition  
  const answeredState = answeringMachine.transition(initialState, 'ANSWER');
  answeredState.done; // true



// state.childer : an object mapping spawned service/actor IDs
// to their instances

const machine = Machine({
    // ...
    invoke: [
        { id: 'notifier', src: createNotifer},
        { id: 'logger', src: createLogger }
    ]
});

const service = invoke (machine)
    .onTransition((state) => {
        state.children.notifier;
        state.children.logger;
    })
    .start();

const fetchMachine = Machine({
    id: 'fetch',
    initial: 'idle',
    states: {
        idle: {
            on: { FETCH: 'loading'}
        },
        loading: {
            after: {
                3000: 'failure.timeout'
            },
            on: {
                RESOLVE: 'success',
                REJECT : 'failure',
                TIEMOUT: 'failure.timeout'
            },
            meta: {
                message: 'Loading...'
            }
        },
        success: {
            meta: {
                message: 'The request succeeded!'
            }
        },
        failure: {
            initial: 'rejection',
            states: {
                rejection: {
                    meta: {
                        message: 'The request failed.'
                    }
                },
                timeout: {
                    meta: {
                        message: 'The request timed out.'
                    }
                }
            },
            meta: {
                alert: 'Uh oh.'
            }
        }
    }
});





