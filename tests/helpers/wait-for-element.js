export default element => {

    return new Promise(resolve => {

        function checkAttached() {

            if (element.attached) {
                return void resolve();
            }

            return window.setTimeout(checkAttached, 1);

        }

        window.setTimeout(checkAttached, 1);

    });

};
