#!/bin/bash

# Backend Test Runner Script
# This script provides various options for running tests with different configurations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --help              Show this help message"
    echo "  -a, --all               Run all tests (default)"
    echo "  -u, --unit              Run only unit tests"
    echo "  -f, --functional        Run only functional tests"
    echo "  -c, --coverage          Run tests with coverage"
    echo "  -w, --watch             Run tests in watch mode"
    echo "  -v, --verbose           Run tests with verbose output"
    echo "  -r, --reporter          Specify test reporter (spec, dot, verbose)"
    echo "  -t, --timeout           Set test timeout in milliseconds"
    echo "  -p, --parallel          Run tests in parallel"
    echo "  --bail                  Exit on first test failure"
    echo "  --grep                  Run tests matching pattern"
    echo ""
    echo "Examples:"
    echo "  $0                      # Run all tests"
    echo "  $0 -u                   # Run unit tests only"
    echo "  $0 -c -v                # Run with coverage and verbose output"
    echo "  $0 --grep 'auth'        # Run tests containing 'auth'"
    echo "  $0 -p --timeout 10000   # Run in parallel with 10s timeout"
}

# Default values
RUN_MODE="all"
VERBOSE=false
COVERAGE=false
WATCH=false
REPORTER="spec"
TIMEOUT=""
PARALLEL=false
BAIL=false
GREP_PATTERN=""

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_usage
            exit 0
            ;;
        -a|--all)
            RUN_MODE="all"
            shift
            ;;
        -u|--unit)
            RUN_MODE="unit"
            shift
            ;;
        -f|--functional)
            RUN_MODE="functional"
            shift
            ;;
        -c|--coverage)
            COVERAGE=true
            shift
            ;;
        -w|--watch)
            WATCH=true
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -r|--reporter)
            REPORTER="$2"
            shift 2
            ;;
        -t|--timeout)
            TIMEOUT="$2"
            shift 2
            ;;
        -p|--parallel)
            PARALLEL=true
            shift
            ;;
        --bail)
            BAIL=true
            shift
            ;;
        --grep)
            GREP_PATTERN="$2"
            shift 2
            ;;
        *)
            print_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Function to check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    print_success "Dependencies check passed"
}

# Function to install dependencies if needed
install_dependencies() {
    if [ ! -d "node_modules" ]; then
        print_status "Installing dependencies..."
        npm install
        print_success "Dependencies installed"
    else
        print_status "Dependencies already installed"
    fi
}

# Function to build the project
build_project() {
    print_status "Building project..."
    npm run build
    print_success "Project built successfully"
}

# Function to run tests
run_tests() {
    local test_command="node ace test"
    
    # Add coverage if requested
    if [ "$COVERAGE" = true ]; then
        test_command="$test_command --coverage"
    fi
    
    # Add watch mode if requested
    if [ "$WATCH" = true ]; then
        test_command="$test_command --watch"
    fi
    
    # Add reporter
    test_command="$test_command --reporter=$REPORTER"
    
    # Add timeout if specified
    if [ -n "$TIMEOUT" ]; then
        test_command="$test_command --timeout=$TIMEOUT"
    fi
    
    # Add parallel if requested
    if [ "$PARALLEL" = true ]; then
        test_command="$test_command --parallel"
    fi
    
    # Add bail if requested
    if [ "$BAIL" = true ]; then
        test_command="$test_command --bail"
    fi
    
    # Add grep pattern if specified
    if [ -n "$GREP_PATTERN" ]; then
        test_command="$test_command --grep='$GREP_PATTERN'"
    fi
    
    # Add verbose if requested
    if [ "$VERBOSE" = true ]; then
        test_command="$test_command --verbose"
    fi
    
    # Add specific test directories based on mode
    case $RUN_MODE in
        "unit")
            test_command="$test_command tests/unit"
            ;;
        "functional")
            test_command="$test_command tests/functional"
            ;;
        "all")
            # Run all tests (default)
            ;;
    esac
    
    print_status "Running tests with command: $test_command"
    print_status "Test mode: $RUN_MODE"
    
    if [ "$VERBOSE" = true ]; then
        print_status "Verbose output enabled"
    fi
    
    if [ "$COVERAGE" = true ]; then
        print_status "Coverage reporting enabled"
    fi
    
    if [ "$WATCH" = true ]; then
        print_status "Watch mode enabled"
    fi
    
    # Execute the test command
    eval $test_command
}

# Function to show test summary
show_summary() {
    print_status "Test execution completed"
    
    if [ "$COVERAGE" = true ]; then
        print_status "Coverage report generated"
        if [ -d "coverage" ]; then
            print_status "Coverage directory: ./coverage"
        fi
    fi
    
    print_success "All operations completed successfully"
}

# Main execution
main() {
    print_status "Starting backend test runner..."
    
    # Check dependencies
    check_dependencies
    
    # Install dependencies if needed
    install_dependencies
    
    # Build project
    build_project
    
    # Run tests
    run_tests
    
    # Show summary
    show_summary
}

# Handle script interruption
trap 'print_error "Test execution interrupted"; exit 1' INT TERM

# Run main function
main "$@"
