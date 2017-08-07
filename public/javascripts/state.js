class States{
	constructor()
	{
		this.draw = true;//Default value is currently draw, may change later
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
	to be false
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
	Parameters: string state ('draw', 'select', 'resize')
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
