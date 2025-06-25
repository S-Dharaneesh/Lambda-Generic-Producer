
# Lambda Generic Producer

## 🧾 Description

The Lambda Generic Producer is an AWS Lambda-based API that processes incoming order data via HTTP POST requests, validates and transforms it, and publishes the result to a downstream endpoint. The service is designed for seamless integration with webhook-based consumers and is structured for scalability and maintainability.

---

## ⚙️ Installation

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18.x or higher recommended)
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)
- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)
- AWS credentials configured (`aws configure`)

### Steps

```bash
# Clone the repository
git clone https://github.com/your-org/lambda-order-publisher.git
cd lambda-order-publisher

# Install dependencies
npm install

# Build the project
sam build

# Deploy the stack (interactive guide)
sam deploy --guided
```

During deployment, set environment variables such as:

- `PUBLISH_URL`: The destination endpoint to which transformed data will be sent.

---

## 🚀 Usage

### Available Endpoints

| Method | Path                           | Description              |
|--------|--------------------------------|--------------------------|
| POST   | `/process/order/v1`            | Publishes order data     |
| GET    | `/process/order/v1/healthCheck`| Health status check      |

---

## ❗ Troubleshooting

| Problem                                  | Solution                                                        |
|------------------------------------------|------------------------------------------------------------------|
| Module not found errors                  | Ensure dependencies are installed and included during build      |
| `POST` request returns 404               | Check if `sam local start-api` is running and path is correct    |
| Environment variable missing             | Add to `template.yaml` or set it in AWS Console after deploy     |
| Lambda logs not visible                  | Use `sam logs -n FunctionName` or check CloudWatch               |

---

## 🔗 Resources

- [AWS Lambda](https://docs.aws.amazon.com/lambda/)
- [AWS SAM](https://docs.aws.amazon.com/serverless-application-model/)
- [Webhook.site for Testing](https://webhook.site/)
- [Postman](https://www.postman.com/) for API testing

