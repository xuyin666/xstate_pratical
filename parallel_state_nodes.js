const fileMachine = Machine({
    id: 'file',
    type: 'parallel',
    states: {
        upload: {
            initial: 'idle',
            states: {
                idle: {
                    on: {
                        INIT_UPLOAD: 'pending'
                    }
                },
                pending: {
                    on: {
                        UPLOAD_COMPLETE: 'success' 
                    }
                },
                success: {}
            }
        },
        download: {
            initial: 'idle',
            states: {
                idle: {
                    on : {
                        INIT_DOWNLOAD: 'pending'
                    }
                },
                pending: {
                    on: {
                        DOWNLOAD_COMPLETE: 'success'
                    }
                },
                success: {}
            }
        }
    }
});


console.log(fileMachine.initialState.value);

console.log(
    fileMachine.transition(
        {
            upload: 'pending',
            download: 'idle'
        },
        'UPLOAD_COMPLETE'
    ).value
);



const lightMachine = Machine({
    id: 'light',
    initial: 'green',
    states: {
        green: {
            on: { TIMER: 'yellow' }
        },
        yellow: {
            on: { TIMER: 'red'}
        },
        red: {
            type: 'parallel',
            states: {
                walkSign: {
                    initial: 'solid',
                    states: {
                        solid: {
                            on: { COUNTDOWN: 'flashing'}
                        },
                        flashing: {
                            on: {STOP_COUNTDOWN: 'solid'}
                        }
                    }
                },
                pedestrian: {
                    initial: 'walk',
                    states: {
                        walk: {
                            on: { COUNTDOWN: 'wait'}
                        },
                        wait: {
                            on: { STOP_COUNTDOWN: 'stop'}
                        },
                        stop:{
                            type: 'final'
                        } 
                    }
                }
            }
        }
    }
});

console.log(lightMachine.transition('yellow', 'TIMER').value);
