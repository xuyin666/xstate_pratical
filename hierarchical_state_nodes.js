const pedestrianStates = {
    initial: 'walk',
    states: {
        walk: {
            on: {
                PED_COUNTDOWN: 'wait'
            }
        },
        wait: {
            on: {
                PED_COUNTDOWN: 'stop'
            }
        },
        stop: {},
        blinking: {}
    }
};

const lightMachine = Machine({
    key: 'light',
    initial: 'green',
    states: {
        green: {
            on: {
                TIMER: 'yellow'
            }
        },
        yellow: {
            on: {
                TIMER: 'red'
            }
        },
        red: {
            on: {
                TIMER: 'green'
            },
            //...pedestrianStates
        }
        
    },
    on: {
        POWER_OUTAGE: '.red.blinking',
        POWER_RESTORED: '.red'
    }
});