# Coinpaprika Documentation Guide

This guide explains how to update and maintain the documentation for [docs.coinpaprika.com](https://docs.coinpaprika.com).

## Overview

The documentation is built with Mintlify and consists of:
- **REST API Reference** (Rendered from `api-reference/rest-api/openapi.yml`)
- **Streaming API Reference** (Rendered from `api-reference/streaming-api/asyncapi.yml`)
- **Guides & SDK Information** (Manually created Markdown `.mdx` files)
- **Overall Configuration** (`docs.json` handles the main settings, navigation, and branding)

## Updating the API References

The technical API references are rendered directly from their specification files. Unlike other setups, there is no scraping or code generation step required to update the documentation for the REST or Streaming APIs.

- **To update the REST API:** Modify the content of `documentation/api-reference/rest-api/openapi.yml`.
- **To update the Streaming API:** Modify the content of `documentation/api-reference/streaming-api/asyncapi.yml`.

Mintlify will automatically reflect the changes in the documentation when you run the local development server or when the site is deployed.

## Running the Documentation Locally

To preview your changes on your local machine before publishing:

1.  **Clone the repository**:
    ```bash
    # Replace with the correct repository URL
    git clone https://github.com/coinpaprika/coinpaprika-api-docs
    cd coinpaprika-api-docs/documentation
    ```
2.  **Install Mintlify CLI** (this only needs to be done once):
    ```bash
    npm i -g mintlify
    ```
3.  **Run the local development server**:
    ```bash
    mintlify dev
    ```
4.  Open the local URL provided in your terminal (usually `http://localhost:3000`) to see the documentation site. The site will hot-reload as you make changes to the files.

## How Files Are Displayed

| File / Directory                               | Where It Appears on the Docs Site                               | Purpose                                                                |
| ---------------------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `docs.json`                                    | **Main Settings File**                                          | Controls navigation, branding, SEO, and overall document structure.    |
| `index.mdx`                                    | [docs.coinpaprika.com](https://docs.coinpaprika.com)            | The main landing page for the documentation.                           |
| `api-reference/rest-api/openapi.yml`           | The **REST API** tab                                            | The source file that generates the entire REST API reference.          |
| `api-reference/streaming-api/asyncapi.yml`     | The **Streaming API** tab                                       | The source file that generates the entire Streaming API reference.     |
| `get-started/`                                 | The "SDKs & Libraries" section                                  | Contains individual pages for different official SDKs.                 |
| `style.css`                                    | Global                                                          | Provides custom CSS styling for the documentation.                     |

## Summary

- **To update API docs:** Simply edit the corresponding `openapi.yml` or `asyncapi.yml` file. No scraping command is needed.
- **To add guides or pages:** Create a new `.mdx` file and add it to the navigation structure in `docs.json`.
- **To test changes:** Run `mintlify dev` from within the `documentation` directory.
- **`docs.json` is the master file:** It controls navigation, appearance, and site-wide settings.
- For more information on Mintlify features and components, visit the official [Mintlify Documentation](https://mintlify.com/docs/getting-started).

If you have any questions, please reach out to the team. 🚀  
