#include <sys/types.h>
#include <sys/wait.h>
#include <stdlib.h>
#include <stdio.h>
#include <errno.h>
#include <unistd.h>

int main(int argc, char * argv[]) {
	int pid, status, digit, sum;

    printf("Введите число: ");
    scanf("%d", &digit);
    sum = 0;

    pid = fork();

    if (pid < 0) {
		perror("Error:");
		 
		return EXIT_FAILURE;

    } else if (pid == 0) {
		printf("Child is working\n");
		
        while (digit != 0) {
			sum = sum + abs(digit % 10);
			digit = digit / 10;

		}
        printf("Сумма цифр: %d\n", sum);

	}
	else {
		printf("Parent is working\n");

		if (wait(&status) == -1) {
			perror("Error wait:");

			return EXIT_FAILURE;
		}

		if (WIFEXITED(status)) {
			printf("Child terminated normally with exit code %i\n", WEXITSTATUS(status));
		}
	}

    return EXIT_SUCCESS;

}
