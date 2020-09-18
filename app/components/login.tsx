import { MagicUserMetadata } from 'magic-sdk'
import React, { useEffect, useState } from 'react'
import {
    Button,
    Form,
    FormGroup,
    FormLabel,
    FormControl,
} from 'react-bootstrap'

import { getUser, loginUser } from '../services/userService'

function Authenticate() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [userDetails, setUserDetails] = useState<MagicUserMetadata>(null)

  //const history = useHistory();
    useEffect(() => {
        load()
    }, []);

    async function load() {
        setUserDetails(await getUser())
    }
    const handleSubmit = async (event) => {
        try {
            event.preventDefault()
            setLoading(true)

            if (!email) {
                setLoading(false)
                setError('Missing email')
                return
            }

            await loginUser(email)
            setUserDetails(await getUser())
            setLoading(false)
            //history.replace('/dashboard');
        }
        catch (err) {
            setError(`Error logging in: ${err}`)
            console.error(err)
        }
    };

    const handleChange = (event) => {
        setEmail(event.target.value)
    };

    if (userDetails) {
        return (
            <div>
                <h3>Welcome, {userDetails.email}</h3>
                <h5>{userDetails.publicAddress}</h5>

            </div>
        )
    } else {
        return (
            <div>
                <Form onSubmit={handleSubmit}>
                    <FormGroup controlId="formBasicEmail">
                        <FormLabel>Enter Email Address</FormLabel>
                        <FormControl
                            type="email"
                            name="email"
                            id="email"
                            value={email}
                            onChange={handleChange}
                            placeholder="Email Address"
                        />
                        <p className="text-danger text-small">{error}</p>
                    </FormGroup>
                    <Button
                        type="submit"
                        className="d-block w-100"
                        variant="primary"
                    >
                        {loading ? 'Logging in...' : 'Log in'}
                    </Button>
                </Form>
            </div>
        );
    }

};
export default Authenticate;