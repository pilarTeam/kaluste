import Select from 'react-select'

function IconSetTrash(props) {
  const component = props.component;
  function handleClick() {
    if (confirm('Are you sure you want to remove this component? This can\'t be undone!')) {
      // 
      switch (props?.type) {
        case 'removeTab':
          component.state.dataset.tabs.find(tab => tab?.id == props?.id).inVisible = true;
          break;
        default:
          break;
      }
    }
  }
  return (
    <span className="customizer__tab__header__trash__icon" onClick={handleClick}>
      <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.99997 8H6.5M6.5 8V18C6.5 19.1046 7.39543 20 8.5 20H15.5C16.6046 20 17.5 19.1046 17.5 18V8M6.5 8H17.5M17.5 8H19M9 5H15M9.99997 11.5V16.5M14 11.5V16.5" stroke="#464455" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </span>
  );
}
function Singletabfields(props) {
  const tab = props.tab;const component = props.component;
  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ];
  return (
    <div className="customizer__field" name="myselect" key={tab?.id??0}>
      <div className="customizer__field">
        <span>This is a single field</span>
        <Select options={options} />
      </div>
    </div>
  );
};
// this.customizer = 
function CustomizerBody(props) {
  const component = props.component;
  if (component.state.isLoaded) {
    const tabsList = component.state.dataset.tabs.filter(tab => !(tab?.inVisible)).map(tab =>
      <li
        className="customizer__tab"
        key={tab.id}
      >
        <div className="customizer__tab__body">
          <div className="customizer__tab__header">
            <div className="customizer__tab__header__title">{tab.title}</div>
            <div className="customizer__tab__header__trash"><IconSetTrash type={'removeTab'} id={tab.id} component={component} /></div>
          </div>
          <div className="customizer__tab__body">
            <div className="customizer__fields">
              <Singletabfields tab={tab} component={component}/>
            </div>
          </div>
        </div>
      </li>
    );
    return (
      <ul className="customizer__tabs">{tabsList}</ul>
    );
  } else {
    return <Loader />;
  }
} 


// Loader Component
function Loader(props) {
  return <span className="customizer__loading">Loading...</span>;
}

// Parent Customizer Component
class Customizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isLoaded: true,
      dataset: {
        tabs: [
        {id: 0, title: 'Sample tab', fields: [
          // {}
        ]}
      ]
    },
      product_id: parseInt(props?.product_id??'0')
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event) {
    this.setState({value: event.target.value});
  }
  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
    console.log(Array.from(new FormData(document.customizer)).reduce((o,[k,v])=>(o[k]=v,o),{}));
  }
  render() {
    return (
      <div>
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <form className="customizer__form" name="customizer" method="post" onSubmit={this.handleSubmit}>
            <CustomizerBody state={this.state} component={ this } />
            <button type="submit">Update</button>
          </form>
        )}
      </div>
    );
  }
}
export default Customizer;