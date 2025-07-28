import React, { useState, useEffect } from 'react';

// Individual input components to prevent re-rendering issues
const TextInput = ({ value, onChange, placeholder, type = "text", style, ...props }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={style}
      {...props}
    />
  );
};

const MarigoldApp = () => {
  // API Configuration
  const API_BASE = 'https://staging.empromptu.ai/api_tools';
  const API_HEADERS = {
    'Authorization': 'Bearer 4e31d5e989125dc49a09d234c59e85bc',
    'X-Generated-App-ID': '4264c9ab-b803-4fcb-b529-2929fdb7c015',
    'X-Usage-Key': 'ccfbd5ba750c00f60be606165b14983f',
    'Content-Type': 'application/json'
  };

  // Main app state
  const [currentScreen, setCurrentScreen] = useState('login');
  const [showHelp, setShowHelp] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [apiLogs, setApiLogs] = useState([]);
  const [showApiData, setShowApiData] = useState(false);
  const [apiResponses, setApiResponses] = useState({});
  
  // Form states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [ssn, setSsn] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [pinVerify, setPinVerify] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [sendAmount, setSendAmount] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  // Contact form state
  const [contactFullName, setContactFullName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  // Styles object - static to prevent re-creation
  const styles = {
    app: {
      backgroundColor: '#000',
      color: '#fff',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px'
    },
    logo: {
      fontSize: '32px',
      fontFamily: 'serif',
      background: 'linear-gradient(45deg, #FFA500, #FFD700)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '10px'
    },
    flower: {
      fontSize: '48px',
      marginBottom: '20px'
    },
    container: {
      maxWidth: '400px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#1a1a1a',
      borderRadius: '15px'
    },
    input: {
      width: '100%',
      padding: '15px',
      margin: '10px 0',
      backgroundColor: '#333',
      border: '1px solid #555',
      borderRadius: '8px',
      color: '#fff',
      fontSize: '16px',
      boxSizing: 'border-box'
    },
    button: {
      width: '100%',
      padding: '15px',
      margin: '10px 0',
      backgroundColor: '#FFA500',
      border: 'none',
      borderRadius: '25px',
      color: '#000',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer'
    },
    secondaryButton: {
      width: '100%',
      padding: '15px',
      margin: '10px 0',
      backgroundColor: 'transparent',
      border: '2px solid #FFA500',
      borderRadius: '25px',
      color: '#FFA500',
      fontSize: '16px',
      cursor: 'pointer'
    },
    helpMenu: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#1a1a1a',
      padding: '30px',
      borderRadius: '15px',
      border: '2px solid #FFA500',
      zIndex: 1000
    },
    keypad: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '15px',
      margin: '20px 0'
    },
    keypadButton: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      backgroundColor: '#333',
      border: '2px solid #555',
      color: '#fff',
      fontSize: '24px',
      cursor: 'pointer'
    },
    userList: {
      backgroundColor: '#1a1a1a',
      padding: '15px',
      margin: '10px 0',
      borderRadius: '10px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    smallButton: {
      padding: '8px 15px',
      backgroundColor: '#FFA500',
      border: 'none',
      borderRadius: '15px',
      color: '#000',
      fontSize: '12px',
      cursor: 'pointer',
      margin: '0 5px'
    },
    apiPanel: {
      position: 'fixed',
      top: '10px',
      right: '10px',
      backgroundColor: '#1a1a1a',
      border: '2px solid #FFA500',
      borderRadius: '10px',
      padding: '15px',
      maxWidth: '300px',
      maxHeight: '400px',
      overflow: 'auto',
      zIndex: 1000
    },
    debugButton: {
      position: 'fixed',
      top: '10px',
      right: '10px',
      padding: '10px',
      backgroundColor: '#28a745',
      border: 'none',
      borderRadius: '5px',
      color: '#fff',
      cursor: 'pointer',
      zIndex: 1001
    },
    deleteButton: {
      position: 'fixed',
      top: '10px',
      right: '120px',
      padding: '10px',
      backgroundColor: '#dc3545',
      border: 'none',
      borderRadius: '5px',
      color: '#fff',
      cursor: 'pointer',
      zIndex: 1001
    }
  };

  // API Helper Functions
  const logApiCall = (endpoint, data, response) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      endpoint,
      request: data,
      response
    };
    setApiLogs(prev => [...prev, logEntry]);
    console.log('API Call:', logEntry);
  };

  const apiCall = async (endpoint, data) => {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      logApiCall(endpoint, data, result);
      
      if (result.object_name) {
        setApiResponses(prev => ({
          ...prev,
          [result.object_name]: result
        }));
      }
      
      return result;
    } catch (error) {
      console.error('API Error:', error);
      logApiCall(endpoint, data, { error: error.message });
      return { error: error.message };
    }
  };

  const deleteApiObject = async (objectName) => {
    try {
      const response = await fetch(`${API_BASE}/objects/${objectName}`, {
        method: 'DELETE',
        headers: API_HEADERS
      });
      
      const result = await response.json();
      logApiCall(`DELETE /objects/${objectName}`, {}, result);
      
      setApiResponses(prev => {
        const updated = { ...prev };
        delete updated[objectName];
        return updated;
      });
      
      return result;
    } catch (error) {
      console.error('Delete Error:', error);
      return { error: error.message };
    }
  };

  // Initialize user data
  useEffect(() => {
    const initializeUserData = async () => {
      const csvData = `username,firstName,lastName,email,pin,balance
john_doe,John,Doe,john@example.com,1234,1000
jane_smith,Jane,Smith,jane@example.com,5678,1000
bob_wilson,Bob,Wilson,bob@example.com,9012,1000
alice_brown,Alice,Brown,alice@example.com,3456,1000`;

      try {
        await apiCall('/input_data', {
          created_object_name: 'user_data_csv',
          data_type: 'strings',
          input_data: [csvData]
        });

        await apiCall('/apply_prompt', {
          created_object_names: ['processed_users'],
          prompt_string: 'Parse this CSV data and convert it to a JSON array of user objects: {user_data_csv}',
          inputs: [
            {
              input_object_name: 'user_data_csv',
              mode: 'combine_events'
            }
          ]
        });

        const userData = await apiCall('/return_data', {
          object_name: 'processed_users',
          return_type: 'json'
        });

        if (userData.value) {
          try {
            const parsedUsers = JSON.parse(userData.value);
            setUsers(parsedUsers);
          } catch (e) {
            console.error('Failed to parse user data, using fallback');
            setUsers([
              { username: 'john_doe', firstName: 'John', lastName: 'Doe', email: 'john@example.com', pin: '1234', balance: 1000 },
              { username: 'jane_smith', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', pin: '5678', balance: 1000 },
              { username: 'bob_wilson', firstName: 'Bob', lastName: 'Wilson', email: 'bob@example.com', pin: '9012', balance: 1000 },
              { username: 'alice_brown', firstName: 'Alice', lastName: 'Brown', email: 'alice@example.com', pin: '3456', balance: 1000 }
            ]);
          }
        }
      } catch (error) {
        console.error('API initialization failed, using fallback data');
        setUsers([
          { username: 'john_doe', firstName: 'John', lastName: 'Doe', email: 'john@example.com', pin: '1234', balance: 1000 },
          { username: 'jane_smith', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', pin: '5678', balance: 1000 },
          { username: 'bob_wilson', firstName: 'Bob', lastName: 'Wilson', email: 'bob@example.com', pin: '9012', balance: 1000 },
          { username: 'alice_brown', firstName: 'Alice', lastName: 'Brown', email: 'alice@example.com', pin: '3456', balance: 1000 }
        ]);
      }
    };

    initializeUserData();
  }, []);

  // Helper functions
  const handleSendMoney = async () => {
    if (!selectedUser || !sendAmount || sendAmount <= 0) return;
    
    const amount = parseFloat(sendAmount);
    
    const transactionData = {
      from: currentUser.username,
      to: selectedUser,
      amount: amount,
      timestamp: new Date().toISOString()
    };

    await apiCall('/input_data', {
      created_object_name: 'transactions',
      data_type: 'strings',
      input_data: [JSON.stringify(transactionData)]
    });

    const updatedUsers = users.map(user => {
      if (user.username === currentUser.username) {
        return { ...user, balance: user.balance - amount };
      }
      if (user.username === selectedUser) {
        return { ...user, balance: user.balance + amount };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    setCurrentUser(updatedUsers.find(u => u.username === currentUser.username));
    setSendAmount('');
    setSelectedUser('');
    setCurrentScreen('transactions');
  };

  const handleLogin = () => {
    const user = users.find(u => u.pin === pin);
    if (user) {
      setCurrentUser(user);
      setCurrentScreen('transactions');
    } else {
      alert('Invalid PIN');
    }
  };

  const handleContactSubmit = async () => {
    const contactData = {
      fullName: contactFullName,
      email: contactEmail,
      phone: contactPhone,
      message: contactMessage
    };

    await apiCall('/input_data', {
      created_object_name: 'contact_messages',
      data_type: 'strings',
      input_data: [JSON.stringify(contactData)]
    });

    alert("We've received your message and will contact you shortly!");
    setContactFullName('');
    setContactEmail('');
    setContactPhone('');
    setContactMessage('');
    setShowHelp(false);
  };

  const clearAllApiData = async () => {
    const objectNames = Object.keys(apiResponses);
    for (const objectName of objectNames) {
      await deleteApiObject(objectName);
    }
    setApiLogs([]);
  };

  // Screen render functions
  const renderLoginScreen = () => (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.flower}>ð¼</div>
        <div style={styles.logo}>Marigold & Co.</div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <span style={{ marginRight: '10px' }}>ðºð¸</span>
        <TextInput
          type="tel"
          placeholder="Phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          style={styles.input}
        />
      </div>
      
      <button 
        style={styles.button}
        onClick={() => setCurrentScreen('sms')}
      >
        Continue
      </button>
      
      <button 
        style={styles.secondaryButton}
        onClick={() => setShowHelp(true)}
      >
        Need Help?
      </button>
    </div>
  );

  const renderHelpMenu = () => (
    <div style={styles.helpMenu}>
      <h3>Do You Need Help?</h3>
      <button style={styles.button} onClick={() => setCurrentScreen('contact')}>
        Forgotten PIN
      </button>
      <button style={styles.button} onClick={() => setCurrentScreen('contact')}>
        I've got a new phone number
      </button>
      <button style={styles.button} onClick={() => setCurrentScreen('contact')}>
        Q & A
      </button>
      <button 
        style={styles.secondaryButton}
        onClick={() => setShowHelp(false)}
      >
        â Close
      </button>
    </div>
  );

  const renderContactScreen = () => (
    <div style={styles.container}>
      <h2>Contact Marigold</h2>
      <TextInput
        type="text"
        placeholder="Full Name"
        value={contactFullName}
        onChange={(e) => setContactFullName(e.target.value)}
        style={styles.input}
      />
      <TextInput
        type="email"
        placeholder="Email"
        value={contactEmail}
        onChange={(e) => setContactEmail(e.target.value)}
        style={styles.input}
      />
      <TextInput
        type="tel"
        placeholder="Phone Number"
        value={contactPhone}
        onChange={(e) => setContactPhone(e.target.value)}
        style={styles.input}
      />
      <textarea
        placeholder="Message"
        value={contactMessage}
        onChange={(e) => setContactMessage(e.target.value)}
        style={{...styles.input, height: '100px'}}
      />
      <button style={styles.button} onClick={handleContactSubmit}>
        Send
      </button>
      <button 
        style={styles.secondaryButton}
        onClick={() => setCurrentScreen('login')}
      >
        Back
      </button>
    </div>
  );

  const renderSMSScreen = () => (
    <div style={styles.container}>
      <h2>SMS Code</h2>
      <p>Enter the code sent to your phone</p>
      
      <TextInput
        type="text"
        placeholder="Enter SMS code"
        value={smsCode}
        onChange={(e) => setSmsCode(e.target.value)}
        style={styles.input}
        maxLength="6"
      />
      
      <div style={styles.keypad}>
        {[1,2,3,4,5,6,7,8,9,'',0,'â«'].map((num, idx) => (
          <button
            key={idx}
            style={styles.keypadButton}
            onClick={() => {
              if (num === 'â«') {
                setSmsCode(prev => prev.slice(0, -1));
              } else if (num !== '') {
                setSmsCode(prev => prev + num);
              }
            }}
          >
            {num}
          </button>
        ))}
      </div>
      
      <button 
        style={styles.button}
        onClick={() => setCurrentScreen('account1')}
      >
        Verify
      </button>
      
      <button 
        style={styles.secondaryButton}
        onClick={() => setCurrentScreen('login')}
      >
        Back
      </button>
    </div>
  );

  const renderAccountScreen1 = () => (
    <div style={styles.container}>
      <h2>Create Account</h2>
      <TextInput
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        style={styles.input}
      />
      <TextInput
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        style={styles.input}
      />
      <TextInput
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />
      <TextInput
        type="text"
        placeholder="SSN"
        value={ssn}
        onChange={(e) => setSsn(e.target.value)}
        style={styles.input}
      />
      <TextInput
        type="date"
        placeholder="Birthdate"
        value={birthdate}
        onChange={(e) => setBirthdate(e.target.value)}
        style={styles.input}
      />
      
      <button 
        style={styles.button}
        onClick={() => setCurrentScreen('account2')}
      >
        Next
      </button>
    </div>
  );

  const renderAccountScreen2 = () => (
    <div style={styles.container}>
      <h2>Address Information</h2>
      <TextInput
        type="text"
        placeholder="Street Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        style={styles.input}
      />
      <TextInput
        type="text"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={styles.input}
      />
      <TextInput
        type="text"
        placeholder="State"
        value={state}
        onChange={(e) => setState(e.target.value)}
        style={styles.input}
      />
      <TextInput
        type="text"
        placeholder="ZIP Code"
        value={zipCode}
        onChange={(e) => setZipCode(e.target.value)}
        style={styles.input}
      />
      
      <button 
        style={styles.button}
        onClick={() => setCurrentScreen('idConsent')}
      >
        Next
      </button>
    </div>
  );

  const renderIDConsentScreen = () => (
    <div style={styles.container}>
      <h2>ID Verification</h2>
      <div style={{ textAlign: 'left', margin: '20px 0' }}>
        <p><strong>ID Document:</strong> As part of our secure onboarding process, we will ask you to scan your US government issued ID.</p>
        
        <p><strong>Take a Photo:</strong> Marigold & Co. uses biometric technology to verify you are you and not someone pretending to be you. (Don't worry, if you didn't do your hair today. We won't be sharing this with anyone.)</p>
        
        <p><strong>Verify Your Identity:</strong> This isn't a credit check and won't affect your credit score. We need to confirm your identity to comply with the USA Patriot Act.</p>
      </div>
      
      <label style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
        <input
          type="checkbox"
          checked={agreeTerms}
          onChange={(e) => setAgreeTerms(e.target.checked)}
          style={{ marginRight: '10px' }}
        />
        I agree with the terms of use
      </label>
      
      <button 
        style={styles.button}
        onClick={() => setCurrentScreen('docVerify')}
        disabled={!agreeTerms}
      >
        Continue
      </button>
    </div>
  );

  const renderDocumentVerifyScreen = () => (
    <div style={styles.container}>
      <h2>Document Verification</h2>
      
      <select
        value={documentType}
        onChange={(e) => setDocumentType(e.target.value)}
        style={styles.input}
      >
        <option value="">Select Document Type</option>
        <option value="passport">Passport</option>
        <option value="drivers_license">Driver's License</option>
      </select>
      
      <TextInput
        type="text"
        placeholder="Document Number"
        value={documentNumber}
        onChange={(e) => setDocumentNumber(e.target.value)}
        style={styles.input}
      />
      
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <p>ð· Scan Front of Document</p>
        <p>ð· Scan Back of Document</p>
      </div>
      
      <button 
        style={styles.button}
        onClick={() => setCurrentScreen('liveness')}
      >
        Next
      </button>
    </div>
  );

  const renderLivenessScreen = () => (
    <div style={styles.container}>
      <h2>Liveness Verification</h2>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <div style={{ fontSize: '80px' }}>ð·</div>
        <p>Take a selfie to verify your identity</p>
      </div>
      
      <button 
        style={styles.button}
        onClick={() => setCurrentScreen('usernameSetup')}
      >
        Next
      </button>
    </div>
  );

  const renderUsernameSetupScreen = () => (
    <div style={styles.container}>
      <h2>Username Setup</h2>
      <p>Choose a username for your account</p>
      
      <TextInput
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={styles.input}
      />
      
      <button 
        style={styles.button}
        onClick={() => setCurrentScreen('pinEntry')}
      >
        Next
      </button>
    </div>
  );

  const renderPINEntryScreen = () => (
    <div style={styles.container}>
      <h2>Create Your PIN</h2>
      <p>Enter a 4-digit PIN for secure access</p>
      
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <div style={{ fontSize: '24px', letterSpacing: '10px' }}>
          {'â'.repeat(pin.length)}{'â'.repeat(4 - pin.length)}
        </div>
      </div>
      
      <div style={styles.keypad}>
        {[1,2,3,4,5,6,7,8,9,'',0,'â«'].map((num, idx) => (
          <button
            key={idx}
            style={styles.keypadButton}
            onClick={() => {
              if (num === 'â«') {
                setPin(prev => prev.slice(0, -1));
              } else if (num !== '' && pin.length < 4) {
                setPin(prev => prev + num);
              }
            }}
          >
            {num}
          </button>
        ))}
      </div>
      
      <button 
        style={styles.button}
        onClick={() => setCurrentScreen('pinVerify')}
        disabled={pin.length !== 4}
      >
        Next
      </button>
    </div>
  );

  const renderPINVerifyScreen = () => (
    <div style={styles.container}>
      <h2>Verify Your PIN</h2>
      <p>Re-enter your 4-digit PIN</p>
      
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <div style={{ fontSize: '24px', letterSpacing: '10px' }}>
          {'â'.repeat(pinVerify.length)}{'â'.repeat(4 - pinVerify.length)}
        </div>
      </div>
      
      <div style={styles.keypad}>
        {[1,2,3,4,5,6,7,8,9,'',0,'â«'].map((num, idx) => (
          <button
            key={idx}
            style={styles.keypadButton}
            onClick={() => {
              if (num === 'â«') {
                setPinVerify(prev => prev.slice(0, -1));
              } else if (num !== '' && pinVerify.length < 4) {
                setPinVerify(prev => prev + num);
              }
            }}
          >
            {num}
          </button>
        ))}
      </div>
      
      <button 
        style={styles.button}
        onClick={async () => {
          if (pin === pinVerify) {
            const newUser = {
              username,
              firstName,
              lastName,
              email,
              pin,
              balance: 1000
            };
            
            await apiCall('/input_data', {
              created_object_name: 'new_users',
              data_type: 'strings',
              input_data: [JSON.stringify(newUser)]
            });
            
            setUsers([...users, newUser]);
            setCurrentUser(newUser);
            setCurrentScreen('welcome');
          } else {
            alert('PINs do not match');
            setPinVerify('');
          }
        }}
        disabled={pinVerify.length !== 4}
      >
        Complete Setup
      </button>
    </div>
  );

  const renderWelcomeScreen = () => (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.flower}>ð¼</div>
        <div style={styles.logo}>Welcome to Marigold & Co.!</div>
      </div>
      
      <p style={{ textAlign: 'center', margin: '30px 0' }}>
        Your FDIC insured spending and savings accounts have been established and your Mastercard debit card is on its way to you. Now let's get you set up to start saving and earning immediately!
      </p>
      
      <button 
        style={styles.button}
        onClick={() => setCurrentScreen('transactions')}
      >
        Get Started
      </button>
    </div>
  );

  const renderTransactionsScreen = () => (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.flower}>ð¼</div>
        <div style={styles.logo}>Marigold & Co.</div>
      </div>
      
      {currentUser && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h3>Welcome, {currentUser.firstName}!</h3>
          <p>Balance: ${currentUser.balance.toFixed(2)}</p>
        </div>
      )}
      
      <h3>Recent Contacts</h3>
      {users.filter(u => u.username !== currentUser?.username).map(user => (
        <div key={user.username} style={styles.userList}>
          <div>
            <strong>{user.firstName} {user.lastName}</strong>
            <br />
            <small>@{user.username}</small>
          </div>
          <div>
            <button 
              style={styles.smallButton}
              onClick={() => {
                setSelectedUser(user.username);
                setCurrentScreen('sendMoney');
              }}
            >
              Send
            </button>
            <button style={styles.smallButton}>Request</button>
          </div>
        </div>
      ))}
      
      <button 
        style={styles.secondaryButton}
        onClick={() => {
          setCurrentUser(null);
          setCurrentScreen('login');
        }}
      >
        Logout
      </button>
    </div>
  );

  const renderSendMoneyScreen = () => {
    const recipient = users.find(u => u.username === selectedUser);
    
    return (
      <div style={styles.container}>
        <h2>Send Money</h2>
        {recipient && (
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <p>Sending to: <strong>{recipient.firstName} {recipient.lastName}</strong></p>
            <p>Your balance: ${currentUser.balance.toFixed(2)}</p>
          </div>
        )}
        
        <TextInput
          type="number"
          placeholder="Amount to send"
          value={sendAmount}
          onChange={(e) => setSendAmount(e.target.value)}
          style={styles.input}
          min="0"
          max={currentUser.balance}
        />
        
        <button 
          style={styles.button}
          onClick={handleSendMoney}
          disabled={!sendAmount || sendAmount <= 0 || sendAmount > currentUser.balance}
        >
          Send ${sendAmount || '0'}
        </button>
        
        <button 
          style={styles.secondaryButton}
          onClick={() => setCurrentScreen('transactions')}
        >
          Cancel
        </button>
      </div>
    );
  };

  const renderDemoLoginScreen = () => (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.flower}>ð¼</div>
        <div style={styles.logo}>Marigold & Co.</div>
        <p>Demo Login - Enter PIN</p>
      </div>
      
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <div style={{ fontSize: '24px', letterSpacing: '10px' }}>
          {'â'.repeat(pin.length)}{'â'.repeat(4 - pin.length)}
        </div>
      </div>
      
      <div style={styles.keypad}>
        {[1,2,3,4,5,6,7,8,9,'',0,'â«'].map((num, idx) => (
          <button
            key={idx}
            style={styles.keypadButton}
            onClick={() => {
              if (num === 'â«') {
                setPin(prev => prev.slice(0, -1));
              } else if (num !== '' && pin.length < 4) {
                setPin(prev => prev + num);
              }
            }}
          >
            {num}
          </button>
        ))}
      </div>
      
      <button 
        style={styles.button}
        onClick={handleLogin}
        disabled={pin.length !== 4}
      >
        Login
      </button>
      
      <button 
        style={styles.secondaryButton}
        onClick={() => setCurrentScreen('login')}
      >
        New User? Sign Up
      </button>
      
      <div style={{ marginTop: '20px', fontSize: '12px', color: '#888' }}>
        <p>Demo PINs: 1234 (John), 5678 (Jane), 9012 (Bob), 3456 (Alice)</p>
      </div>
    </div>
  );

  const renderApiDebugPanel = () => (
    <div style={styles.apiPanel}>
      <h4>API Debug Panel</h4>
      <div style={{ maxHeight: '300px', overflow: 'auto' }}>
        {apiLogs.map((log, idx) => (
          <div key={idx} style={{ marginBottom: '10px', fontSize: '12px' }}>
            <strong>{log.endpoint}</strong>
            <br />
            <code>{JSON.stringify(log.request, null, 2)}</code>
            <br />
            <code>{JSON.stringify(log.response, null, 2)}</code>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );

  // Main render
  return (
    <div style={styles.app}>
      {/* Debug Controls */}
      <button 
        style={styles.debugButton}
        onClick={() => setShowApiData(!showApiData)}
      >
        {showApiData ? 'Hide' : 'Show'} API Data
      </button>
      
      <button 
        style={styles.deleteButton}
        onClick={clearAllApiData}
      >
        Clear API Data
      </button>

      {showApiData && renderApiDebugPanel()}
      {showHelp && renderHelpMenu()}
      
      {currentScreen === 'login' && renderLoginScreen()}
      {currentScreen === 'demoLogin' && renderDemoLoginScreen()}
      {currentScreen === 'contact' && renderContactScreen()}
      {currentScreen === 'sms' && renderSMSScreen()}
      {currentScreen === 'account1' && renderAccountScreen1()}
      {currentScreen === 'account2' && renderAccountScreen2()}
      {currentScreen === 'idConsent' && renderIDConsentScreen()}
      {currentScreen === 'docVerify' && renderDocumentVerifyScreen()}
      {currentScreen === 'liveness' && renderLivenessScreen()}
      {currentScreen === 'usernameSetup' && renderUsernameSetupScreen()}
      {currentScreen === 'pinEntry' && renderPINEntryScreen()}
      {currentScreen === 'pinVerify' && renderPINVerifyScreen()}
      {currentScreen === 'welcome' && renderWelcomeScreen()}
      {currentScreen === 'transactions' && renderTransactionsScreen()}
      {currentScreen === 'sendMoney' && renderSendMoneyScreen()}
      
      {/* Quick demo access button */}
      {currentScreen === 'login' && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button 
            style={{...styles.secondaryButton, fontSize: '12px'}}
            onClick={() => setCurrentScreen('demoLogin')}
          >
            Demo Login (Existing Users)
          </button>
        </div>
      )}
    </div>
  );
};

export default MarigoldApp;
