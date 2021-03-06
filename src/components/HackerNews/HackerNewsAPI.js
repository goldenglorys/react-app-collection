import React, { Component } from "react";
import "./HackerNews.css";
import axios from "axios";

const DEFAULT_QUERY = "redux";
const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
const page = "0";

class HackerNewsAPI extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      searchTerm: DEFAULT_QUERY,
      searchKey: "",
      error: null,
      isLoading: false,
    };
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
  }

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  setSearchTopStories(result) {
    const { hits, page } = result;
    const { searchKey, results } = this.state;
    const oldHits =
      results && results[searchKey] ? results[searchKey].hits : [];
    const updatedHits = [...oldHits, ...hits];

    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page },
      },
      isLoading: false,
    });
  }

  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = (item) => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);

    this.setState({
      results: { ...results, [searchKey]: { hits: updatedHits, page } },
    });
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm, page);
    }
    event.preventDefault();
  }

  fetchSearchTopStories(searchTerm, page) {
    this.setState({ isLoading: true });
    axios
      .get(
        `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`
      )
      .then((result) => this.setSearchTopStories(result.data))
      .catch((error) => this.setState({ error }));
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm, page);
  }

  render() {
    const { searchTerm, results, searchKey, error, isLoading } = this.state;
    const page =
      (results && results[searchKey] && results[searchKey].page) || 0;
    const list =
      (results && results[searchKey] && results[searchKey].hits) || [];

    return (
      <div className="body">
        <div className="page">
          <div className="interactions">
            <h2>Hacker News</h2>
            <div>
              <small>
                Search and get latest news from the hacker news daily hits
              </small>
            </div>{" "}
            <br />
            <HackerNewsSearch
              value={searchTerm}
              onChange={this.onSearchChange}
              onSubmit={this.onSearchSubmit}
            />
          </div>
          {error ? (
            <div className="interactions">
              <p>Something went wrong. Please try again!</p>
            </div>
          ) : (
            <HackerNewsTable list={list} onDismiss={this.onDismiss} />
          )}
          <div className="interactions">
            {isLoading ? (
              <Loading />
            ) : (
              <button
                onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
              >
                More
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

class HackerNewsSearch extends Component {
  render() {
    const { value, onChange, onSubmit } = this.props;
    return (
      <form onSubmit={onSubmit}>
        <input type="text" value={value} onChange={onChange} />
        <button type="submit">Search</button>
      </form>
    );
  }
}

class HackerNewsTable extends Component {
  render() {
    const { list, onDismiss } = this.props;
    return (
      <div className="table">
        <div className="table-row">
          <strong style={{ width: "10%" }}>S/N</strong>
          <strong style={{ width: "40%" }}>Title</strong>
          <strong style={{ width: "30%" }}>Author</strong>
          <strong style={{ width: "10%" }}>Comments</strong>
          <strong style={{ width: "10%" }}>Points</strong>
          <strong style={{ width: "10%" }}>Action</strong>
        </div>
        {list.map((item, index) => (
          <div key={item.objectID} className="table-row">
            <span style={{ width: "10%" }}>{index + 1}</span>
            <span style={{ width: "40%" }}>
              <a href={item.url}>{item.title}</a>
            </span>
            <span style={{ width: "30%" }}>{item.author}</span>
            <span style={{ width: "10%" }}>{item.num_comments}</span>
            <span style={{ width: "10%" }}>{item.points}</span>
            <span style={{ width: "10%" }}>
              <button
                onClick={() => onDismiss(item.objectID)}
                type="button"
                className="button-inline"
              >
                Dismiss
              </button>
            </span>
          </div>
        ))}
      </div>
    );
  }
}

const Loading = () => {
  return (
    <div>
      <i className="fa fa-spinner fa-spin"></i>
    </div>
  );
};

export default HackerNewsAPI;

export { HackerNewsAPI, HackerNewsTable, HackerNewsSearch };
