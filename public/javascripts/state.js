class States{

	/*
	Constructor: States
	Parameters:
	Return value: an instatnce of States Class, with mode set to draw
	*/
	constructor()
	{
		this.draw = true;
		this.select = false;
		this.resize = false;
		this.delete = false;
		this.move = false;
	}

	/*
	Method: _secFalse
	Parameters:
	Return value: undefined
	Description: Private method that sets the values of all fields of the class
	to be false (please note: unless used in strict mode, there is no acutal
	'private' methods or variables in JavaScript, so this method can still be
	accessed from outside of the class, but please don't do that)
	*/
	_setFalse()
	{
		this.draw = false;
		this.select = false;
		this.resize = false;
		this.delete = false;
		this.move = false;
	}

	/*
	Method: setState
	Parameters: String state ('draw', 'select', 'resize')
	Return value: undefined
	Description: Public method that sets the state, ensures only one state is
	true at all time. Please don't directly set the state as having multiple
	states to be true at the same time will cause problems
	*/
	setState(state)
	{
		this._setFalse();

		switch(state){
			case 'draw':
				this.draw = true;
				break;
			case 'select':
				this.select = true;
				break;
			case 'resize':
				this.resize = true;
				break;
			case 'delete':
				this.delete = true;
				break;
			case 'move':
				this.move = true;
				break;
			default:
				this.select = true;
				console.log("state value doesn't exist");//only for debugging
		}
	}


}
