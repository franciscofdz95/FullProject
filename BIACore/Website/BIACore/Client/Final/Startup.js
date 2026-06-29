// This needs to be the last (or nearly last) *.js added to BIACore.js
// As everything sets up, they register with onLoad or onStart; this
// lets them all register nicely and then we fire the starting gun.
// if you don't need onLoad or onStart, you can create files after this.
(function () {
    // add the page ready event to the 'load' queue.
    BIACore.Event.load(BIACore.bindDomReady, BIACore);
    //BIACore.bindDomReady();
    // since we aren't dynamically loading javascript files anymore, 
    // we can start our init process as soon as this is reached.
    BIACore.Event.fire('init');
}());
